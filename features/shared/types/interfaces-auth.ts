//user
export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  tokens: TokensDTO;
  modulesVisibility: ModulesPermissions;
};

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
export type UserRole = keyof typeof UserRole;

export type ModulesPermissions = {
  information: ModuleOverallPermission;
  field_crops: FieldCropsSubmodules;
  greenhouse_crops: GreenhouseCropsSubmodule;
  // concierge: ModuleOverallPermission;
  // extra_works_quantity: ModuleOverallPermission;
  // extra_works_zp: ModuleOverallPermission;
  // extra_works_hobby: ModuleOverallPermission;
  general_works: GeneralWorksSubmodules;
  // tray_operations: TrayOperationsSubModules;
};

export type TrayOperationsSubModules = ModuleOverallPermission & {
  destroy_tray: boolean;
  replacement_tray: boolean;
  report_damaged_trays: boolean;
  move_to_garden: boolean;
  disconnect_from_zp: boolean;
  add_to_zp: boolean;
};

export type ModuleOverallPermission = { is_whole_module_available: boolean };
export type GreenhouseCropsSubmodule = ModuleOverallPermission & {
  //greenhouse_crops_works
  greenhouse_crops_works___overallVisibility: boolean;
  greenhouse_crops_works_actions_confirmation_tomato: boolean;
  greenhouse_crops_works_actions_confirmation_cucumber: boolean;
  greenhouse_crops_works_works_planning_tomato: boolean;
  greenhouse_crops_works_works_planning_cucumber: boolean;
  greenhouse_crops_works_loading_forecast: boolean;
  greenhouse_crops_works_internal_transport: boolean;
  greenhouse_crops_works_order_export_to_customer: boolean;
  // greenhouse_crops_works_order_to_spacing;

  //extra_works_quantity
  extra_works_quantity___overallVisibility: boolean;

  //extra_works_zp
  extra_works_zp___overallVisibility: boolean;
};
export type FieldCropsSubmodules = ModuleOverallPermission & {
  //field_crops_works
  field_crops_works___overallVisibility: boolean;
  field_crops_works_internal_transport: boolean;
  field_crops_works_plants_coming_ups_counter: boolean;
  field_crops_works_protective_treatment: boolean;
  field_crops_works_loading_forecast: boolean;
  field_crops_works_order_to_hardener: boolean;
  field_crops_works_order_to_internal_transport: boolean;
  field_crops_works_order_export_to_customer: boolean;
  field_crops_works_cut: boolean;
  field_crops_works_loading: boolean;
  field_crops_nitrogen_irrigation: boolean;
  //extra_works_quantity
  extra_works_quantity___overallVisibility: boolean;
  //extra_works_zp
  extra_works_zp___overallVisibility: boolean;
  //extra_works_hobby
  extra_works_hobby___overallVisibility: boolean;
  extra_works_hobby_extra_works_quantity: boolean;
  extra_works_hobby_extra_works_zp: boolean;
  //tray_operations
  tray_operations___overallVisibility: boolean;
  tray_operations_destroy_tray: boolean;
  tray_operations_replacement_tray: boolean;
  tray_operations_report_damaged_trays: boolean;
  tray_operations_move_to_garden: boolean;
  tray_operations_disconnect_from_zp: boolean;
  tray_operations_add_to_zp: boolean;
};
export type GeneralWorksSubmodules = ModuleOverallPermission & {
  watering_plants: boolean;
};
export type AllCropsOrdersSubmodules =
  | "field_crops_works_order_to_hardener"
  | "field_crops_works_internal_transport"
  | "field_crops_works_order_export_to_customer"
  | "greenhouse_crops_works_order_to_spacing"
  | "greenhouse_crops_works_order_export_to_customer";

export type AllExportToCustomerSubmodules =
  | "field_crops_works_order_export_to_customer"
  | "greenhouse_crops_works_order_export_to_customer";

export type AllLoadingForecastSubmodules =
  | "field_crops_works_loading_forecast"
  | "greenhouse_crops_works_loading_forecast";

export type AllInternalTransportSubmodules =
  | "field_crops_works_internal_transport"
  | "greenhouse_crops_works_internal_transport";

export type TokensDTO = {
  token: string;
  refreshToken: string;
};

//login
export type LoginInput = {
  username: string;
  password: string;
};

export type TError = {
  error: { code: number; message: string };
};

export type UserProfileDTO = {
  data?: FetchedUserDTO;
  error?: TError;
};
export type FetchedUserDTO = {
  usr_id: number;
  usrnam: string;
  e_mail: string;
};

export type AdminsIds = number[];
export type AdminsGroup = {
  data?: FetchedUserDTO;
  error?: TError;
};
export type UserPermissionDTO = {
  data: {
    resultMainQuery: {
      usr_id: string;
      os: string;
      app_version: string;
      app_build: string;
    }[];
  };
};
export type UserPermission = {
  usr_id: number;
  os: string;
  app_version: string;
  app_build: string;
};

export type AppVersionAndBuild = Pick<
  UserPermission,
  "app_version" | "app_build"
>;

// type Vals<T> = T[keyof T];
// type PathsOf<T> = T extends object
//   ? T extends Array<infer Item>
//     ? [] | [number] | [number, ...PathsOf<Item>]
//     : Vals<{ [P in keyof T]-?: [] | [P] | [P, ...PathsOf<T[P]>] }>
//   : [];
// export type SubModules<T> = PathsOf<T>;
