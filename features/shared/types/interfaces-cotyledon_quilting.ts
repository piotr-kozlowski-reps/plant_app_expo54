import { Tray } from "./interfaces-tray";

export type CotyledonQuiltingDTO = {
  sordid: string;
  ordnmb: string;
  open: string;
  pcm_ilosc: string;
  twr_kod: string;
  twr_nazwa: string;
  tray_type: string;
  array_agg: string | null;
  iletac: string;
  cid: string;
  mid: string;
};
export type CotyledonQuilting = {
  sordid: number;
  ordnmb: string;
  open: boolean;
  pcm_ilosc: string;
  twr_kod: string;
  twr_nazwa: string;
  tray_type: string;
  array_agg: string | null;
  iletac: number;
  cid: number;
  mid: number;
};

export type ColorForCotyledonQuiltingInput = {
  colorTray: CotyledonQuilting | null;
};

export type QuantityForCotyledonQuiltingInput = {
  quantity: number;
};

export type CotyledonQuiltingAddingTraysPostDTO = {
  ip: string;
  sordid: number;
  ordnmb: string;
  twr_kod: string;
  twr_nazwa: string;
  // quantity: number;
  cid: number;
  mid: number;
  trays: Pick<Tray, "stk_id" | "scanned_raw_value">[];
};

export type CotyledonQuiltingQuantityAndCloseColorPostDTO = {
  ip: string;
  sordid: number;
  ordnmb: string;
  twr_kod: string;
  twr_nazwa: string;
  quantity: number;
  cid: number;
  mid: number;
};

export type CotyledonQuiltingResponse = string[];
