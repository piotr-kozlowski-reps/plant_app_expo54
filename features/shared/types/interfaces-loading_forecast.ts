import { ZPDetailedInfo } from "./interfaces-zp";

export type LoadingForecastInput = {
  traysQuantity: number;
  zpInfo: ZPLoadingForecastInfo | null;
};

export type ZPLoadingForecastInfo = Pick<
  ZPDetailedInfo,
  | "ordnmb"
  | "twrnzw"
  | "stkcnt"
  | "outid_"
  | "outmvplan"
  | "cutid_"
  | "outcnt"
  | "risecnt"
  | "wsk_palet"
> & {
  sordid: number;
  scanned_raw_value: string;
};

export type Patch_LoadingForecast_DTO = {
  idOfPatchedItem: number;
  stkcnt: number;
  scanned_raw_value: string;
};
