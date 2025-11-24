import { ZPShortenedInfoWithoutTwrnzw } from "./interfaces-zp";

export type WorkToPlan = {
  prior_: number;
  ptc_kod: string;
};
export type WorkToPlanDTO = {
  prior_: string;
  ptc_kod: string;
};

export type WorkPlanningDataToSend = {
  scannedValues: ZPInfoForWorkPlanning[];
  workToPlan: WorkToPlan | null;
  inHowManyDays: number | null;
};

export type WorkPlanningSendDataDTO = {
  ordnmb: string;
  id: number;
  plndat: Date;
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
