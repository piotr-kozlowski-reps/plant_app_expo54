export type InformationDTO = {
  label: string;
  value: string | null;
  prior: string;
};

export type InformationResponse = {
  data: {
    resultMainQuery: InformationDTO[] | -1;
  };
};

export type TechnicalInformationDTO = {
  ptc_kod: string;
  ptc_lp: string;
  plan_xl: string | null;
  real_dt: string | null;
  watch_dt: string | null;
  delta_days: string | null;
  delta_days_watch: string | null;
};
export type TechnicalInformation = {
  ptc_kod: string;
  ptc_lp: number;
  plan_xl: Date | null;
  real_dt: Date | null;
  watch_dt: Date | null;
  delta_days: number | null;
  delta_days_watch: number | null;
};

export type TechnicalInformationResponse = {
  data: {
    resultMainQuery: TechnicalInformationDTO[] | -1;
  };
};
