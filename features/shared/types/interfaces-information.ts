export type InformationDTO = {
  label: string;
  details: string | null;
  prior: string;
};

export type InformationResponse = {
  data: {
    resultMainQuery: InformationDTO[] | -1;
  };
};
