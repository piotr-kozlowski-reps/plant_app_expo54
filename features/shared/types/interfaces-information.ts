export type InformationDTO = {
  label: string;
  value: string | null | React.ReactNode;
  prior: string;
};

export type InformationResponse = {
  data: {
    resultMainQuery: InformationDTO[] | -1;
  };
};
