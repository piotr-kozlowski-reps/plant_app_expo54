import { ProtectiveTreatment } from "./interfaces-protective_treatment";

export type TypeOfScannedValue =
  | "tray"
  | "zp_gru"
  | "zp_roz"
  | "field"
  | "unknown";

export type Combobox<T> = {
  value: T | null;
  visibleText: string;
};

export type Param = {
  name: string;
  value: string;
};

export type InHowManyDaysKeyValue = {
  name: string;
  value: number;
};
export type NitrogenConcentrationKeyValue = {
  name: string;
  value: ProtectiveTreatment;
};

export type DocId = {
  doc_id: string;
};
export type DocIdRequestDTO = {
  dctpid: number;
  dscrpt: string;
  prc_id: number;
  // prtpid: number;
};

export type GlobalErrorDTO = {
  mldevc: string;
  ml_uid: number | undefined;
  mldata: Date;
  mlprms: { error_message: string };
  traceon: true;
};

export type GlobalErrorResponse = string[];

export type InfoModal = {
  title: string;
  info1: string;
  info2?: string;
  confirmationButtonName: string;
};

export type DTOReportReturnType<T> = {
  data: {
    resultMainQuery: T[] | -1;
  };
};

export type Separator = { type__: "separator" };
export function isSeparator(testedObject: any): testedObject is Separator {
  return (
    typeof testedObject === "object" &&
    testedObject !== null &&
    "type__" in testedObject &&
    typeof (testedObject as any).type__ === "string"
  );
}
