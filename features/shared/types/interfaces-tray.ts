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
