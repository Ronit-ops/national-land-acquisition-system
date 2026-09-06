import { useEffect, useRef } from "react";
import {
  LngLatBounds,
  Map as MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from "maplibre-gl";

import type {
  GisMapViewport,
  GisParcel,
} from "../types/gis";

import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  parcels: GisParcel[];
  selectedParcelId: string | null;
  onParcelSelect: (parcel: GisParcel | null) => void;
  initialViewport?: GisMapViewport;
};

const defaultViewport: GisMapViewport = {
  longitude: 73.91,
  latitude: 18.58,
  zoom: 11.2,
};

function getParcelColor(
  status: GisParcel["acquisitionStatus"],
) {
  switch (status) {
    case "POSSESSION_COMPLETED":
      return "#16a34a";

    case "READY_FOR_POSSESSION":
      return "#2563eb";

    case "RR_IN_PROGRESS":
      return "#ca8a04";

    case "COMPENSATION_PENDING":
      return "#ea580c";

    case "UNDER_ACQUISITION":
      return "#7c3aed";

    case "ON_HOLD":
      return "#dc2626";

    default:
      return "#64748b";
  }
}

function createParcelGeoJson(parcels: GisParcel[]) {
  return {
    type: "FeatureCollection" as const,

    features: parcels.map((parcel) => ({
      type: "Feature" as const,

      id: parcel.id,

      properties: {
        parcelId: parcel.parcelId,
        surveyNumber: parcel.surveyNumber,
        recordedRightHolder:
          parcel.recordedRightHolder,
        district: parcel.district,
        village: parcel.village,
        areaHectares: parcel.areaHectares,
        landUse: parcel.landUse,
        acquisitionStatus:
          parcel.acquisitionStatus,
        statusColor: getParcelColor(
          parcel.acquisitionStatus,
        ),
      },

      geometry: {
        type: "Polygon" as const,
        coordinates: [parcel.coordinates],
      },
    })),
  };
}

function getParcelSource(
  map: MapLibreMap,
): GeoJSONSource | null {
  const source = map.getSource("parcels");

  if (!source || source.type !== "geojson") {
    return null;
  }

  return source as GeoJSONSource;
}

function MapView({
  parcels,
  selectedParcelId,
  onParcelSelect,
  initialViewport = defaultViewport,
}: MapViewProps) {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<MapLibreMap | null>(null);

  const parcelsRef = useRef(parcels);

  const selectedParcelIdRef =
    useRef(selectedParcelId);

  const onParcelSelectRef =
    useRef(onParcelSelect);

  useEffect(() => {
    parcelsRef.current = parcels;
  }, [parcels]);

  useEffect(() => {
    selectedParcelIdRef.current = selectedParcelId;
  }, [selectedParcelId]);

  useEffect(() => {
    onParcelSelectRef.current = onParcelSelect;
  }, [onParcelSelect]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new MapLibreMap({
      container: mapContainerRef.current,

      style: {
        version: 8,

        sources: {
          "osm-raster": {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              "© OpenStreetMap contributors",
          },

          parcels: {
            type: "geojson",

            data: {
              type: "FeatureCollection",
              features: [],
            },
          },
        },

        layers: [
          {
            id: "osm-raster",
            type: "raster",
            source: "osm-raster",
          },

          {
            id: "parcel-fill",
            type: "fill",
            source: "parcels",

            paint: {
              "fill-color": [
                "coalesce",
                ["get", "statusColor"],
                "#64748b",
              ],

              "fill-opacity": [
                "case",

                [
                  "boolean",
                  ["feature-state", "selected"],
                  false,
                ],

                0.45,

                0.22,
              ],
            },
          },

          {
            id: "parcel-outline",
            type: "line",
            source: "parcels",

            paint: {
              "line-color": [
                "case",

                [
                  "boolean",
                  ["feature-state", "selected"],
                  false,
                ],

                "#111827",

                "#475569",
              ],

              "line-width": [
                "case",

                [
                  "boolean",
                  ["feature-state", "selected"],
                  false,
                ],

                3,

                1.2,
              ],
            },
          },
        ],
      },

      center: [
        initialViewport.longitude,
        initialViewport.latitude,
      ],

      zoom: initialViewport.zoom,

      minZoom: 4,
      maxZoom: 19,
    });

    map.addControl(
      new NavigationControl(),
      "top-right",
    );

    map.on("load", () => {
      const source = getParcelSource(map);

      if (!source) {
        return;
      }

      source.setData(
        createParcelGeoJson(
          parcelsRef.current,
        ),
      );

      if (parcelsRef.current.length > 0) {
        map.fitBounds(
          getParcelBounds(parcelsRef.current),
          {
            padding: 70,
            maxZoom: 13,
            duration: 0,
          },
        );
      }
    });

    map.on(
      "click",
      "parcel-fill",
      (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];

        if (!feature || feature.id === undefined) {
          return;
        }

        const parcel = parcelsRef.current.find(
          (item) =>
            item.id === String(feature.id),
        );

        if (!parcel) {
          return;
        }

        onParcelSelectRef.current(parcel);
      },
    );

    map.on(
      "mouseenter",
      "parcel-fill",
      () => {
        map.getCanvas().style.cursor =
          "pointer";
      },
    );

    map.on(
      "mouseleave",
      "parcel-fill",
      () => {
        map.getCanvas().style.cursor = "";
      },
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialViewport]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !map.isStyleLoaded()) {
      return;
    }

    const source = getParcelSource(map);

    if (!source) {
      return;
    }

    source.setData(
      createParcelGeoJson(parcels),
    );
  }, [parcels]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !map.isStyleLoaded()) {
      return;
    }

    const previousSelectedId =
      selectedParcelIdRef.current;

    if (previousSelectedId) {
      map.setFeatureState(
        {
          source: "parcels",
          id: previousSelectedId,
        },
        {
          selected: false,
        },
      );
    }

    if (selectedParcelId) {
      map.setFeatureState(
        {
          source: "parcels",
          id: selectedParcelId,
        },
        {
          selected: true,
        },
      );

      const parcel = parcels.find(
        (item) =>
          item.id === selectedParcelId,
      );

      if (parcel) {
        const center = getPolygonCenter(
          parcel.coordinates,
        );

        map.easeTo({
          center,
          zoom: Math.max(
            map.getZoom(),
            13,
          ),
          duration: 500,
        });
      }
    }
  }, [selectedParcelId, parcels]);

  return (
    <div className="gis-map-view">
      <div
        ref={mapContainerRef}
        className="gis-map-view__canvas"
        aria-label="Interactive parcel map"
      />

      <div className="gis-map-view__attribution">
        Demonstration spatial data · © OpenStreetMap
        contributors
      </div>
    </div>
  );
}

function getParcelBounds(
  parcels: GisParcel[],
) {
  const bounds = new LngLatBounds();

  parcels.forEach((parcel) => {
    parcel.coordinates.forEach(
      ([longitude, latitude]) => {
        bounds.extend([
          longitude,
          latitude,
        ]);
      },
    );
  });

  return bounds;
}

function getPolygonCenter(
  coordinates: [number, number][],
): [number, number] {
  if (coordinates.length === 0) {
    return [
      defaultViewport.longitude,
      defaultViewport.latitude,
    ];
  }

  let longitudeTotal = 0;
  let latitudeTotal = 0;

  coordinates.forEach(
    ([longitude, latitude]) => {
      longitudeTotal += longitude;
      latitudeTotal += latitude;
    },
  );

  return [
    longitudeTotal /
      coordinates.length,

    latitudeTotal /
      coordinates.length,
  ];
}

export default MapView;