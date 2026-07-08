export type ZpToChemicalTreatmentsDTO = {
  plan_id: string;
  ordnmb: string;
  sordid: string;
  chemical_treatment_date: string;
  treatid: string;
  tredscrpt: string;
};

export type ZpToChemicalTreatments = {
  plan_id: number;
  ordnmb: string;
  sordid: number;
  chemical_treatment_date: Date;
  treatid: number;
  tredscrpt: string;
};

export type ChemicalTreatmentOrderSendDataDTO = {
  //zp
  sordid: number | null;
  ordnmb: string;

  //date
  chemical_treatment_date: Date;

  //protective treatment
  treatid: number;
  tredscrpt: string;

  //scanned raw value
  scanned_raw_value: string;
};

export type ChemicalTreatmentOrderResponse = string[];
