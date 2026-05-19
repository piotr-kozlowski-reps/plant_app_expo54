export type CotyledonQuiltingDTO = {
  sordid: string;
  ordnmb: string;
  open: string;
  pcm_ilosc: string;
  twr_kod: string;
  twr_nazwa: string;
};
export type CotyledonQuilting = {
  sordid: number;
  ordnmb: string;
  open: boolean;
  pcm_ilosc: string;
  twr_kod: string;
  twr_nazwa: string;
};

export type ColorForCotyledonQuiltingInput = {
  colorTray: CotyledonQuilting | null;
};
