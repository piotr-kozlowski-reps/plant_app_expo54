export type GeneralWorkDTO = {
  keyval: string;
  acname: string;
  module_id: string;
};
export type GeneralWork = {
  keyval: number;
  acname: string;
  module_id: string;
};

export type Post_GeneralWork_DTO = {
  activityid: number;
  donedat: Date;
  mobile: true;
  params_json: GeneralWork_Json[];
};

export type GeneralWork_Json = {
  a: boolean;
  b: boolean;
  c: boolean;
  all: boolean;
  id____: number;
  planam: string;
  scanned_raw_value: string;
  // planam: string
};
