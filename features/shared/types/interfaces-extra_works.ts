export type ExtraWorkDTO = {
  keyval: string;
  activityname: string;
  is_ordnmb: string;
  ishobby: string;
};
export type ExtraWork = {
  keyval: number;
  activityname: string;
  is_ordnmb: boolean;
  ishobby: boolean;
};

export type Post_ExtraWork_ZP_DTO = {
  activityid: number;
  begindat: Date;
  donedat: Date;
  mobile: boolean;
  ordnmb_json: Omit<ZpScannedValue, "sordid">[];
};
export type Post_ExtraWork_QUANTITY_DTO = {
  activityid: number;
  begindat: Date;
  donedat: Date;
  mobile: boolean;
  qntity: number;
};

export type ZpScannedValue = {
  scanned_raw_value: string;
  planam: string;
  ordnmb: string;
  prev_percentage: number;
  act_percentage: number;
  stkcnt_loc: number;
  stkcnt_ordnmb: number;
  sordid: number | null;
};
export type ZpScannedValuePercentage = Pick<ZpScannedValue, "act_percentage">;

export type ZpScannedValueToBeSent = Pick<
  ZpScannedValue,
  | "scanned_raw_value"
  | "planam"
  | "ordnmb"
  | "prev_percentage"
  | "act_percentage"
  | "stkcnt_loc"
  | "stkcnt_ordnmb"
> & { treatid: number | null; dscrpt: string | null; plan_id: number | null };

export type ScanError = {
  value: string;
  errorMessage: string;
};

export type HandlerCode = "ZP" | "QUANTITY";

export type ExtraWorkQuantityInput = {
  qntity: number;
  donedat: Date;
};

export type ActivityTodaysQuantityResponse = {
  data: {
    resultMainQuery: ActivityTodaysQuantityDTO[] | -1;
  };
};
export type ActivityTodaysQuantityDTO = {
  qntity_day: string;
};
export type ActivityTodaysQuantity = {
  qntity_day: number;
};

export type IsHobbyParam = "t" | "f";
