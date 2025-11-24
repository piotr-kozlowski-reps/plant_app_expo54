import { CameraCapturedPicture } from "expo-camera";
import { LocalizationInfoPerScannedField } from "./interfaces-localization";

export type ZPInfoDTO = {
  ordnmb: string;
  stkcnt: string;
};

export type ZPInfo = {
  ordnmb: string;
  stkcnt: number;
};

export type ZPFromFieldDTO = {
  planam: string;
  ordnmb: string;
  prev_percentage: string;
  act_percentage: string;
  stkcnt_loc: string;
  stkcnt_ordnmb: string;
  sordid: string;
};
export type ZPFromField = {
  planam: string;
  ordnmb: string;
  stkcnt: string;
  prev_percentage: number;
  act_percentage: number;
  stkcnt_loc: number;
  stkcnt_ordnmb: number;
  sordid: number;
};

export type ZPFieldListDTO = {
  data: {
    resultMainQuery: ZPFromFieldDTO[] | -1;
  };
};

export type ZPItemDTO = {
  is_repeated: string;
  activityid: string | null;
  planam: string;
  ordnmb: string;
  prev_percentage: string;
  stkcnt_loc: string;
  stkcnt_ordnmb: string;
  act_percentage: string;
  sordid: string;
};
export type ZPItem = {
  is_repeated: boolean;
  activityid: number | null;
  planam: string;
  ordnmb: string;
  prev_percentage: number;
  stkcnt_loc: number;
  stkcnt_ordnmb: number;
  act_percentage: number;
  sordid: number;
};
export type ZPItemResponse = {
  data: {
    resultMainQuery: ZPItemDTO[] | -1;
  };
};

export type ZPDetailedInfo = {
  isgarden: string | null;
  ordid_: number;
  ordnmb: string;
  twrkod: string;
  twrnzw: string;
  stkcnt: number;
  allowmvplan: boolean;
  tmpmvplan: Date | null;
  outmvplan: Date | null;
  tmsdat: Date | null;
  dtlstm: Date | null;
  prc_id: number;
  plndat: Date | null;
  cutid_: number | null;
  outid_: number | null;
  outcnt: number | null;
  risecnt: number | null;
  wsk_palet: number | null;
  stk_id: string | null;
  stkid_: number | null;
};
export type ZPDetailedInfoDTO = {
  isgarden: string | null;
  ordid_: string;
  ordnmb: string;
  twrkod: string;
  twrnzw: string;
  stkcnt: string;
  allowmvplan: string;
  tmpmvplan: string | null;
  outmvplan: string | null;
  tmsdat: string | null;
  dtlstm: string | null;
  prc_id: string;
  plndat: string | null;
  cutid_: string | null;
  outid_: string | null;
  outcnt: string | null;
  risecnt: string | null;
  wsk_palet: string | null;
  stk_id: string | null;
  stkid_: string | null;
};
export type ZPDetailedInfoResponse = {
  data: {
    resultMainQuery: ZPDetailedInfoDTO[] | -1;
  };
};

export type ZPLocalizationInfoDTO = {
  id____: string;
  dscrpt: string;
  ile: string;
  ordout: string;
};
export type ZPLocalizationInfo = {
  id____: number;
  dscrpt: string;
  ile: number;
  ordout: number;
};
export type ZPLocalizationInfoResponse = {
  data: {
    resultMainQuery: ZPLocalizationInfoDTO[] | -1;
  };
};

export type ZPLocalizationInfoPlusQuantityToBeMoved = ZPLocalizationInfo & {
  quantity_to_be_moved: number;
};
export type ZPCombinedInfo = ZPDetailedInfo & {
  localization: ZPLocalizationInfoPlusQuantityToBeMoved[];
  scannedRawValue: string;
};

export type InternalTransportMovements = {
  sordid: number;
  ordnmb: string;
  movfrm: number;
  mov_to: number;
  movqty: number;
  scanned_raw_value: string;
};
export type InternalTransportMovementsResponse = string[];

////
export type AllZPsPerLocalizationWithInfoAboutAllLocalizationsDTO = {
  ordnmb: string;
  sordid: string;
  to_json: string;
};
export type AllZPsPerLocalizationWithInfoAboutAllLocalizations = {
  ordnmb: string;
  sordid: number;
  localization: LocalizationInfoPerScannedField[];
};

export type AllZPsPerLocalizationWithInfoAboutAllLocalizationsResponse = {
  data: {
    resultMainQuery:
      | AllZPsPerLocalizationWithInfoAboutAllLocalizationsDTO[]
      | -1;
  };
};

// export type ZPShortenedInfoDTO = {
//   sordid: string;
//   ordnmb: string;
//   // stkcnt: string;
// };
export type ZPShortenedInfo = {
  sordid: number;
  ordnmb: string;
  twrnzw: string;
  stkcnt: number;
  scanned_raw_value: string;
};
export type ZPShortenedInfoWithoutTwrnzw = Omit<ZPShortenedInfo, "twrnzw">;

export type ZPInLocalizationInfoDTO = {
  planam: string;
  sordid: string;
  ordnmb: string;
  stkcnt: string;
  mvplok: string;
};
export type ZPInLocalizationInfo = {
  planam: string;
  sordid: number;
  ordnmb: string;
  stkcnt: number;
  mvplok: boolean;
};
export type ZPsInLocalizationInfoResponse = {
  data: {
    resultMainQuery: ZPInLocalizationInfoDTO[] | -1;
  };
};

export type ZPShortenedInfoWithPics = {
  sordid: number;
  ordnmb: string;
  pictures: CameraCapturedPicture[];
  tmsdat: Date | null;
  twrnzw: string;
  prc_id: number;
  scannedRawValue: string;
};
