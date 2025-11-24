export type ReportDamagedTraysDTO = {
  stk_id: string;
  usrnam: string;
  dstdat: string;
  dstuid: string;
};
export type ReportDamagedTrays = {
  stk_id: string;
  usrnam: string;
  dstdat: string;
  dstuid: number;
};

export type ReportDamagedTraysResponse = {
  data: {
    resultMainQuery: ReportDamagedTraysDTO[] | -1;
  };
};
