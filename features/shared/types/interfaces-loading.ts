export type ZpScannedValueForLoading = {
  sordid: number;
  ordnmb: string;
  twrnzw: string;
  stkcnt: number;
  outcnt: number | null;
  scannedRawValue: string;
};

export type Post_LoadingDTO = {
  sordid: number;
  ordnmb: string;
  qtrsnd: number | null;
  qtrsty: number | null;
  scanned_raw_value: string;
};

export type LoadingResponse = string[];
