import { useMemo, useState } from "react";
import {
  Layers3,
  MapPinned,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import MapView from "../features/gis/components/MapView";
import { gisLayers } from "../features/gis/data/layers";
import { gisParcels } from "../features/gis/data/parcels";

import type {
  GisLayerId,
  GisParcel,
} from "../features/gis/types/gis";

function statusLabel(status: GisParcel["acquisitionStatus"]) {
  switch (status) {
    case "UNDER_ACQUISITION":
      return "Under Acquisition";

    case "COMPENSATION_PENDING":
      return "Compensation Pending";

    case "RR_IN_PROGRESS":
      return "R&R In Progress";

    case "READY_FOR_POSSESSION":
      return "Ready for Possession";

    case "POSSESSION_COMPLETED":
      return "Possession Completed";

    case "ON_HOLD":
      return "On Hold";

    default:
      return "Not Started";
  }
}

function GisPage() {
  const [selectedParcelId, setSelectedParcelId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [visibleLayers, setVisibleLayers] =
    useState<Record<GisLayerId, boolean>>(
      Object.fromEntries(
        gisLayers.map((layer) => [
          layer.id,
          layer.visible,
        ]),
      ) as Record<GisLayerId, boolean>,
    );

  const selectedParcel = useMemo(
    () =>
      gisParcels.find(
        (parcel) => parcel.id === selectedParcelId,
      ) ?? null,
    [selectedParcelId],
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return gisParcels
      .filter((parcel) =>
        [
          parcel.parcelId,
          parcel.surveyNumber,
          parcel.recordedRightHolder,
          parcel.district,
          parcel.village,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 5);
  }, [search]);

  function toggleLayer(layerId: GisLayerId) {
    setVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  }

  function selectParcel(parcel: GisParcel) {
    setSelectedParcelId(parcel.id);
    setSearch("");
  }

  return (
    <div className="gis-page">
      <header className="gis-page__header">
        <div>
          <span className="gis-eyebrow">
            SPATIAL INTELLIGENCE
          </span>

          <h2>GIS Intelligence</h2>

          <p>
            Explore parcel-centric land information,
            acquisition status and spatial observations.
          </p>
        </div>
      </header>

      <div className="gis-workspace">
        <aside className="gis-sidebar">
          <div className="gis-sidebar__section">
            <div className="gis-section-title">
              <Search size={15} />

              <span>Find Parcel</span>
            </div>

            <div className="gis-search">
              <Search size={15} />

              <input
                type="search"
                placeholder="Parcel, survey or right-holder"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                aria-label="Search GIS parcels"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="gis-search-results">
                {searchResults.map((parcel) => (
                  <button
                    key={parcel.id}
                    type="button"
                    onClick={() =>
                      selectParcel(parcel)
                    }
                  >
                    <strong>{parcel.parcelId}</strong>

                    <span>
                      {parcel.surveyNumber} ·{" "}
                      {parcel.recordedRightHolder}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="gis-sidebar__section">
            <div className="gis-section-title">
              <Layers3 size={15} />

              <span>Map Layers</span>
            </div>

            <div className="gis-layer-list">
              {gisLayers.map((layer) => (
                <label
                  key={layer.id}
                  className={`gis-layer ${
                    !layer.enabled
                      ? "gis-layer--disabled"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={visibleLayers[layer.id]}
                    disabled={!layer.enabled}
                    onChange={() =>
                      toggleLayer(layer.id)
                    }
                  />

                  <span>
                    <strong>{layer.name}</strong>

                    <small>
                      {layer.description}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="gis-sidebar__section">
            <div className="gis-section-title">
              <MapPinned size={15} />

              <span>Status Legend</span>
            </div>

            <div className="gis-legend">
              <LegendItem
                color="#7c3aed"
                label="Under Acquisition"
              />

              <LegendItem
                color="#ca8a04"
                label="R&R In Progress"
              />

              <LegendItem
                color="#2563eb"
                label="Ready for Possession"
              />

              <LegendItem
                color="#16a34a"
                label="Possession Completed"
              />

              <LegendItem
                color="#dc2626"
                label="On Hold"
              />
            </div>
          </div>

          <div className="gis-demo-note">
            <strong>Demonstration Environment</strong>

            <span>
              Parcel geometry shown here is simulated
              spatial data. It does not represent
              authoritative cadastral boundaries.
            </span>
          </div>
        </aside>

        <main className="gis-map-area">
          <MapView
            parcels={
              visibleLayers.parcels
                ? gisParcels
                : []
            }
            selectedParcelId={selectedParcelId}
            onParcelSelect={(parcel) =>
              setSelectedParcelId(
                parcel?.id ?? null,
              )
            }
          />

          {selectedParcel && (
            <section className="gis-parcel-panel">
              <div className="gis-parcel-panel__header">
                <div>
                  <span className="gis-eyebrow">
                    SELECTED PARCEL
                  </span>

                  <h3>
                    {selectedParcel.parcelId}
                  </h3>
                </div>

                <button
                  type="button"
                  className="gis-close-button"
                  onClick={() =>
                    setSelectedParcelId(null)
                  }
                  aria-label="Close parcel details"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="gis-parcel-status">
                {statusLabel(
                  selectedParcel.acquisitionStatus,
                )}
              </div>

              <div className="gis-parcel-owner">
                <UserRound size={15} />

                <div>
                  <span>
                    Recorded Owner / Right-Holder
                  </span>

                  <strong>
                    {
                      selectedParcel.recordedRightHolder
                    }
                  </strong>
                </div>
              </div>

              <div className="gis-parcel-grid">
                <DetailItem
                  label="Survey Number"
                  value={selectedParcel.surveyNumber}
                />

                <DetailItem
                  label="Area"
                  value={`${selectedParcel.areaHectares} ha`}
                />

                <DetailItem
                  label="Land Use"
                  value={selectedParcel.landUse}
                />

                <DetailItem
                  label="Village"
                  value={selectedParcel.village}
                />

                <DetailItem
                  label="District"
                  value={selectedParcel.district}
                />
              </div>

              <div className="gis-provenance-note">
                <ShieldCheck size={14} />

                <span>
                  Right-holder information is displayed
                  as recorded reference data. Verification
                  and legal determination remain separate
                  workflow states.
                </span>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="gis-legend-item">
      <span
        className="gis-legend-dot"
        style={{ background: color }}
      />

      <span>{label}</span>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="gis-detail-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default GisPage;