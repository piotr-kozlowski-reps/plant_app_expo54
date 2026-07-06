export type ModulePinDTO = {
  module_name: string;
  module_pin: string;
};

export type ModulePin = {
  module_name: string;
  module_pin: string;
};

export type ModuleNameForPin =
  | "tray_operations"
  | "potted_plants_tray_operations_disconnect_from_zp"
  | "gru_order_export_to_customer";
