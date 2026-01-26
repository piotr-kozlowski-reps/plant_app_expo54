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
