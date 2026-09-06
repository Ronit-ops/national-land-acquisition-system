export type GisLayerId =
  | "administrative-boundaries"
  | "project-boundaries"
  | "parcels"
  | "acquisition-status"
  | "satellite-observations"
  | "ai-alerts"
  | "field-verification";

export type GisLayerType =
  | "boundary"
  | "parcel"
  | "status"
  | "observation"
  | "alert"
  | "verification";

export type GisLayer = {
  id: GisLayerId;
  name: string;
  description: string;
  type: GisLayerType;
  visible: boolean;
  enabled: boolean;
};

export type ParcelMapStatus =
  | "NOT_STARTED"
  | "UNDER_ACQUISITION"
  | "COMPENSATION_PENDING"
  | "RR_IN_PROGRESS"
  | "READY_FOR_POSSESSION"
  | "POSSESSION_COMPLETED"
  | "ON_HOLD";

export type GisParcelFeatureProperties = {
  parcelId: string;
  surveyNumber: string;
  recordedRightHolder: string;
  district: string;
  village: string;
  areaHectares: number;
  landUse: string;
  acquisitionStatus: ParcelMapStatus;
};

export type GisParcel = {
  id: string;
  parcelId: string;
  surveyNumber: string;
  recordedRightHolder: string;
  district: string;
  village: string;
  areaHectares: number;
  landUse: string;
  acquisitionStatus: ParcelMapStatus;
  coordinates: [number, number][];
};

export type GisMapViewport = {
  longitude: number;
  latitude: number;
  zoom: number;
};