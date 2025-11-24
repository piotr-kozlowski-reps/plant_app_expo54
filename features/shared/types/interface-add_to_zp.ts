export type ZpScannedValueForAddToZp = {
  sordid: number;
  ordnmb: string;
  twrnzw: string;
  twrkod: string;
  scannedRawValue: string;
};

export type TrayScannedValueForAddToZp = {
  ordid_: number;
  ordnmb: string;
  stk_id: string;
  stkid_: number | null;
  twrkod: string;
  twrnzw: string;
  scannedRawValue: string;
  wsk_palet: number | null;
  outid_: number | null;
  isgarden: string | null;

  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  movid1: null | number;
};

export type Post_AddToZp_DTO = {
  //zp data from zp object
  ordnmb: string;
  sordid: number;
  ordid_: number;

  //scanned raw value
  scanned_raw_value: string;

  //tray info
  stk_id: string;
  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  movid1: null | number;
  stkid_: number | null;
  wsk_palet: number | null;
  outid_: number | null;
  isgarden: string | null;
};

export type AddToZpResponse = string[];
