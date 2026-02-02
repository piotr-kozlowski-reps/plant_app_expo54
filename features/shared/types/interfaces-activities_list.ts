import { WorkType } from "./interfaces-works_planning";

export type ZpRozActivityDTO = {
  type__: string;
  is_active: string;
  enabled1: string;
  id: string;
  pcz_id: string;
  start_plan: null | string;
  stop_plan: null | string;
  dscrpt: string;
  ilebeg: string;
  iledne: string;
  status: string;
  activityid: string | null;
  pcz_pzlid: string;
  prior: string;
  enabled: string;
};
export type ZpRozActivity = {
  type__: WorkType;
  is_active: boolean;
  enabled1: boolean;
  id: number;
  pcz_id: number;
  start_plan: null | Date;
  stop_plan: null | Date;
  dscrpt: string;
  ilebeg: number;
  iledne: number;
  status: number | null;
  activityid: number | null;
  pcz_pzlid: number;
  prior: number;
  enabled: boolean;
};

export type ZpRozActivityDetailsDTO = {
  id: string;
  dscrpt: string;
  ilebeg: string;
  iledne: string;
  status: string;
};
export type ZpRozActivityDetails = {
  id: number;
  dscrpt: string;
  ilebeg: number;
  iledne: number;
  status: number;
};

export type ZpRozActivityDetailsResponse = {
  data: {
    resultMainQuery: ZpRozActivityDetailsDTO[] | -1;
  };
};

export type ZpRozActivityResponse = {
  data: {
    resultMainQuery: ZpRozActivityDTO[] | -1;
  };
};

export type ZpRozWithActivities = {
  scannedRawValue: string;
  ordnmb: string;
  activities: ZpRozActivity[];
};

export type QuantityActionsConfirmation = {
  height: number;
};

export type ZpRozActivityConfirmation_DTO = {
  scanned_raw_value: string;
  id: number;
  dscrpt: string;
  pcz_id: number;
  materials: ZpRozActivityMaterial_DTO[];
};

export type ZpRozActivityMaterial_DTO = {
  mat_id: number;
  dscrpt: string;
  pcm_zrealizowana: number;
};

export type ActivityVariant =
  | "greenhouse_crops_works_activity_confirmation_tomato"
  | "greenhouse_crops_works_activity_confirmation_cucumber";

export type ActivityConfirmationResponse = string[];
