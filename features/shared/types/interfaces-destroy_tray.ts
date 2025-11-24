import { CameraCapturedPicture } from "expo-camera";

export type TrayInfoWithPics = {
  ordnmb: string;
  stk_id: string;
  scannedRawValue: string;
  pictures: CameraCapturedPicture[];
};

export type Post_DestroyTray_DTO = {
  stk_id: string;
  ordnmb: string;
  scanned_raw_value: string;
  pictures: ImageDTO[];
};

export type ImageDTO = {
  fileName: string;
  fileContent: string;
  transferEncoding: "base64";
};

export type DestroyTrayResponse = string[];

export type TrayToBeDestroyedInfoDTO = {
  data: {
    resultMainQuery:
      | {
          stk_id: string;
          ordnmb: string;
          doc_id: string | null;
        }[]
      | -1;
  };
};

export type TrayToBeDestroyedInfo = {
  stk_id: string;
  ordnmb: string;
  doc_id: number | null;
};
