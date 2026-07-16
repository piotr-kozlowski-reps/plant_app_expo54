export type ZPPackagingInfo = {
  cid: number;
  prc_id: number;
  sordid: number;
  ordnmb: string;
  pcz_id: number;
  ptc_kod: string;
  isdone: boolean;
};
export type ZPPackagingInfoDTO = {
  cid: string;
  prc_id: string;
  sordid: string;
  ordnmb: string;
  pcz_id: string;
  ptc_kod: string;
  isdone: string;
};

export type ZPPackagingInfoWithScannedRowValue = ZPPackagingInfo & {
  scanned_raw_value: string;
};

export type ZPPackagingInfoResponse = {
  data: {
    resultMainQuery: ZPPackagingInfoDTO[] | -1;
  };
};

export type ZPPackagingInfoPostResponse = string[];
