import { useLayoutEffect, useState } from "react";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { router } from "expo-router";
import { FieldCropsSubmodules } from "../types/interfaces-auth";

export const useGetSubNavigationTrayOperationsElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [
    trayOperationsSubNavigationState,
    setTrayOperationsSubNavigationState,
  ] = useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const trayOperationsSubNavigation: SubNavigationElement[] = [];
    const trayOperationsSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof FieldCropsSubmodules;
    }[] = [
      {
        title: "Niszczenie tacy",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/destroy_tray");
        },
        subModuleName: "tray_operations_destroy_tray",
      },
      {
        title: "Podmiana tacy",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/replacement_tray");
        },
        subModuleName: "tray_operations_replacement_tray",
      },
      {
        title: "Raport zniszczonych tac",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/report_damaged_trays");
        },
        subModuleName: "tray_operations_report_damaged_trays",
      },
      {
        title: "Odepnij na ogródek",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/move_to_garden");
        },
        subModuleName: "tray_operations_move_to_garden",
      },
      {
        title: "Odepnij do bufora",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/disconnect_from_zp");
        },
        subModuleName: "tray_operations_disconnect_from_zp",
      },
      {
        title: "Przypnij do ZP",
        actionFn: () => {
          router.push("/app/field_crops/tray_operations/add_to_zp");
        },
        subModuleName: "tray_operations_add_to_zp",
      },
    ];

    trayOperationsSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<FieldCropsSubmodules>(
        "field_crops",
        navItem.subModuleName
      );

      if (isActive) {
        trayOperationsSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });

    setTrayOperationsSubNavigationState(trayOperationsSubNavigation);
  }, []);

  return trayOperationsSubNavigationState;
};
