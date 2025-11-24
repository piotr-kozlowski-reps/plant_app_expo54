export type TrayReplaceInfo = {
  stk_id: string;
  scanned_raw_value: string;
};

export type TrayReplaceInfoRep88 = {
  ostkid: string | null;
  nstkid: number;
};
export type TrayReplaceInfoRep88DTO = {
  ostkid: string | null;
  nstkid: string;
};
export type TrayReplaceInfoRep88Response = {
  data: {
    resultMainQuery: TrayReplaceInfoRep88DTO[] | -1;
  };
};

export type Post_TrayReplace_DTO = {
  stkold: string;
  stknew: string;
  scanned_raw_value: string;
};

export type TrayReplaceResponse = any; //TODO: change
