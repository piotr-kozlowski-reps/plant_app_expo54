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
  twr_kod: string | null;
  twr_nazwa: string | null;
  ptc_kod: string;
  ptc_lp: string;
  plan_xl: string | null;
  real_dt: string | null;
  watch_dt: string | null;
  delta_days: string | null;
  delta_days_watch: string | null;
};
export type TechnicalInformation = {
  twr_kod: string | null;
  twr_nazwa: string | null;
  ptc_kod: string;
  ptc_lp: number;
  plan_xl: string | null;
  real_dt: string | null;
  watch_dt: string | null;
  delta_days: number | null;
  delta_days_watch: number | null;
};

export type TechnicalInformationResponse = {
  data: {
    resultMainQuery: TechnicalInformationDTO[] | -1;
  };
};
