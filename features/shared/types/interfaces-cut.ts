export type ZpToCutDTO = {
  id____: string;
  sordid: string;
  ordnmb: string;
  plndat: string;
  height: string;
};
export type ZpToCut = {
  id____: number;
  sordid: number;
  ordnmb: string;
  plndat: Date;
  height: number;
};

export type CutInput = {
  height: number;
  plannedDate: Date;
};

export type CutConfirmationInput = {
  height: number | null;
};

export type Post_OrderToCutGRU_DTO = {
  sordid: number;
  ordnmb: string;
  plndat: Date;
  height: number;
  stkcnt: number;
  scanned_raw_value: string;
};

export type Post_CutConfirmation_DTO = {
  cutuid: number;
  cutdat: Date;
  height: number;
  id____: number;
  scanned_raw_value: string;
};
export type Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO = {
  cutuid: number;
  ordnmb: string;
  cutdat: Date;
  height: number;
  scanned_raw_value: string;
};
export type CutConfirmationResponse = string[];
