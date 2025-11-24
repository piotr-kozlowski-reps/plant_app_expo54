export type OrderToHardenerSendDataDTO = {
  sordid: number | null;
  ordnmb: string;
  movdta: Date;
  movtyp: MoveType;
  mov_to: number | null;
  scanned_raw_value: string;
};
export type OrderExportToCustomerSendDataDTO = {
  sordid: number | null;
  ordnmb: string;
  mov_to: null;
  movdta: Date;
  movtyp: "OUT";
  movspc: 0 | 1;
  doc_id: string;
  scanned_raw_value: string;
};

export type MoveType = "TEMP" | "MOVE" | "OUT";

export type OrderToHardenerResponse = string[];
export type OrderExportToCustomerResponse = string[];
