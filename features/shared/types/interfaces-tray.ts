/**
 * Tray:
 *  sordid: number; //ZP id
 *  ordnmb: number; // Numer zlecenia ZP
 *  stk_id: string; //Kod tacy
 *  lckcnt: number; //Ilość braków na tacy
 */
export type Tray = {
  sordid: number;
  ordnmb: string;
  stk_id: string;
  lckcnt: number;
  twrkod: string;
  twrnzw: string;
  risecnt: number;
  allowmvplan: boolean;
  tmpmvplan: Date | null;
  stkcnt: number;
  scanned_raw_value: string;
};
export type TrayDTO = {
  ordid_: string;
  ordnmb: string;
  stk_id: string;
  lckcnt: string;
  twrkod: string;
  twrnzw: string;
  risecnt: string;
  allowmvplan: string;
  tmpmvplan: string;
  stkcnt: string;
};

export type TrayResponse = {
  data: {
    resultMainQuery: TrayDTO[] | -1;
  };
};

export type RiseCountResponse = string[];

export type TrayShortInfo = Pick<Tray, "stk_id" | "scanned_raw_value">;

//tray for don
export type TrayForDonDTO = {
  id____: string;
  stk_id: string;
  ordnmb: string;
  stkprt: string;
  stkdat: string;
  bacdat: null | string;
  is_del: string;
  event_dat: string;
  event_type: string;
};
export type TrayForDon = {
  id____: number;
  stk_id: string;
  ordnmb: string;
  stkprt: number;
  stkdat: Date;
  bacdat: null | Date;
  is_del: boolean;
  event_dat: Date;
  event_type: string;
};
export type TrayForDonResponse = {
  data: {
    resultMainQuery: TrayForDonDTO[] | -1;
  };
};

export type Post_DisconnectTrayFromZp_DTO = {
  ordnmb: string;
  stk_id: string;
  scanned_raw_value: string;
};
