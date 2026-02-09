import { ZpScannedValueToBeSent } from "./interfaces-extra_works";
import { ZPShortenedInfoWithoutTwrnzw } from "./interfaces-zp";

export type WorkType = "TECH" | "EXTRA";
export type WorkToPlanDTO = {
  prior_: string;
  ptc_kod: string;
  type__: string;
};
export type WorkToPlan = {
  prior_: number;
  ptc_kod: string;
  type__: WorkType;
};

export type WorkPlanningDataToSend = {
  scannedValues: ZPInfoForWorkPlanning[];
  workToPlan: WorkToPlan | null;
  inHowManyDays: number | null;
};

export type WorkPlanningSendDataDTO_Tech = {
  ordnmb: string;
  id: number;
  plndat: Date;
  type__: WorkType;
  scanned_raw_value: string;
};
export type WorkPlanningSendDataDTO_Extra = {
  plndat: Date;
  ordnmb_json: ZpScannedValueToBeSent[] | null;
  type__: WorkType;
  activityid: number;
  scanned_raw_value: string;
};
export type WorkPlanningResponse = string[];

export type ZPInfoForWorkPlanning = {
  sordid: number;
  ordnmb: string;
  stkcnt: number;
  rozActivityId: number;

  scanned_raw_value: string;
};

export type WorksPlanningVariant =
  | "greenhouse_crops_works_works_planning_tomato"
  | "greenhouse_crops_works_works_planning_cucumber";
