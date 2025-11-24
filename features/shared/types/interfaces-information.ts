export type InformationDTO = {
  label: string;
  value: string;
  prior: string;
};

export type InformationResponse = {
  data: {
    resultMainQuery: InformationDTO[] | -1;
  };
};
