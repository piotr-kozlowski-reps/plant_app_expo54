export type ZpInProductionDTO = {
  ordnmb: string;
  sordid: string;
  knt_akronim: string;
  glowny: string;
};
export type ZpInProduction = {
  sordid: number;
  ordnmb: string;
  knt_akronim: string;
  glowny: string;
};

// export type CutInput = {
//   height: number;
//   plannedDate: Date;
// };

// export type CutConfirmationInput = {
//   height: number | null;
// };

// export type Post_OrderToCutGRU_DTO = {
//   sordid: number;
//   ordnmb: string;
//   plndat: Date;
//   height: number;
//   stkcnt: number;
//   scanned_raw_value: string;
// };

// export type Post_CutConfirmation_DTO = {
//   cutuid: number;
//   cutdat: Date;
//   height: number;
//   id____: number;
//   scanned_raw_value: string;
// };
// export type Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO = {
//   cutuid: number;
//   ordnmb: string;
//   cutdat: Date;
//   height: number;
//   scanned_raw_value: string;
// };
// export type CutConfirmationResponse = string[];
