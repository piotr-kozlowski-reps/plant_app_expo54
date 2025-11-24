export type NitrogenIrrigationOrderSendDataDTO = {
  //zp
  sordid: number | null;
  ordnmb: string;

  //date
  irrigation_date: Date;

  //protective treatment
  id____: number;
  dscrpt: string;
  typ: string;

  //scanned raw value
  scanned_raw_value: string;
};

export type NitrogenIrrigationOrderResponse = string[];

export type ZpToNitrogenIrrigationDTO = {
  plan_id: string;
  ordnmb: string;
  sordid: string;
  nitrogen_irrigation_date: string;
  treatid: string;
  tredscrpt: string;
};
export type ZpToNitrogenIrrigation = {
  plan_id: number;
  ordnmb: string;
  sordid: number;
  nitrogen_irrigation_date: Date;
  treatid: number;
  tredscrpt: string;
};
