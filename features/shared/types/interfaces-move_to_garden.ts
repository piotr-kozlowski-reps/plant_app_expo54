export type TrayScannedValueForMovingToGarden = {
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

export type Post_MoveToGarden_DTO = {
  stk_id: string;
  ordnmb: string;
  scanned_raw_value: string;
  // isDefective: boolean;

  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  ordid_: number;
  movid1: null | number;

  stkid_: number | null;
  wsk_palet: number | null;
  outid_: number | null;
  isgarden: string | null;
};

export type MoveToGardenResponse = string[];
