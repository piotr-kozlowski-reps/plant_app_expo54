import { Post_MoveToGarden_DTO } from "./interfaces-move_to_garden";

export type TrayScannedValueForDisconnectFromZp = {
  //zp
  ordid_: number;
  ordnmb: string;

  //scanned row value
  scannedRawValue: string;

  //tray
  stk_id: string;
  stkid_: number | null;
  twrkod: string;
  twrnzw: string;
  wsk_palet: number | null;
  outid_: number | null;
  isgarden: string | null;
  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  movid1: null | number;

  //delete reason
  // delete_reason_id: number | null;
  // delete_dscrpt: string | null;
};

export type Post_DisconnectFromZp_DTO = Post_MoveToGarden_DTO & {
  //delete reason
  // delete_reason_id: number;
  // delete_dscrpt: string;
};

export type DisconnectFromZpResponse = string[];

export type GiveReasonInput = {
  reason: DeleteReason | null;
};

export type DeleteReasonDTO = {
  keyval: string;
  delete_reason_id: string;
  delete_dscrpt: string;
};

export type DeleteReason = {
  keyval: number;
  delete_reason_id: number;
  delete_dscrpt: string;
};
