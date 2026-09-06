import type { GisLayer } from "../types/gis";

export const gisLayers: GisLayer[] = [
  {
    id: "administrative-boundaries",
    name: "Administrative Boundaries",
    description:
      "District, taluka and village boundary reference layers.",
    type: "boundary",
    visible: true,
    enabled: true,
  },

  {
    id: "project-boundaries",
    name: "Project Boundaries",
    description:
      "Infrastructure project areas and associated land requirements.",
    type: "boundary",
    visible: true,
    enabled: true,
  },

  {
    id: "parcels",
    name: "Land Parcels",
    description:
      "Parcel boundaries linked to land and acquisition records.",
    type: "parcel",
    visible: true,
    enabled: true,
  },

  {
    id: "acquisition-status",
    name: "Acquisition Status",
    description:
      "Parcel-level acquisition workflow status.",
    type: "status",
    visible: true,
    enabled: true,
  },

  {
    id: "satellite-observations",
    name: "Satellite Observations",
    description:
      "Spatial observations derived from satellite imagery.",
    type: "observation",
    visible: false,
    enabled: true,
  },

  {
    id: "ai-alerts",
    name: "AI Alerts",
    description:
      "Potential changes detected by AI requiring human verification.",
    type: "alert",
    visible: false,
    enabled: true,
  },

  {
    id: "field-verification",
    name: "Field Verification",
    description:
      "Field verification observations and verification status.",
    type: "verification",
    visible: false,
    enabled: true,
  },
];