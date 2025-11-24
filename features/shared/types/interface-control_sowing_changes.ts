export type ControlSowingChanges = {
  errtxt: string;
  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  movid1: null | number;
};
export type ControlSowingChangesDTO = {
  errtxt: string;
  stkid1: string;
  ordid1: string | null;
  ordnmb1: string;
  movid1: null | string;
};

export type ControlSowingChangesResponse = {
  data: {
    resultMainQuery: ControlSowingChangesDTO[] | -1;
  };
};
