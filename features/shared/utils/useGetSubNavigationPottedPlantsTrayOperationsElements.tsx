import { useLayoutEffect, useState } from "react";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { PottedPlantsSubmodules } from "../types/interfaces-auth";
// // import { SubNavigationElement } from "../types/interfaces-navigation";
// // import { GreenhouseCropsSubmodule } from "../types/interfaces-auth";
import { router } from "expo-router";

export const useGetSubNavigationPottedPlantsTrayOperationsElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [
    pottedPlantsTrayOperationsSubNavigationState,
    setPottedTrayOperationsPlantsSubNavigationState,
  ] = useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const pottedPlantsTrayOperationsSubNavigation: SubNavigationElement[] = [];
    const pottedPlantsTrayOperationsSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof PottedPlantsSubmodules;
    }[] = [
      {
        title: "Odepnij tacę",
        actionFn: () => {
          router.push(
            "/app/potted_plants/potted_plants_tray_operations/potted_plants_tray_operations_disconnect_from_zp",
          );
        },
        subModuleName: "potted_plants_tray_operations_disconnect_from_zp",
      },
      //   {
      //     title: "Zlecenie transportu wewnętrznego",
      //     actionFn: () => {
      //       router.push(
      //         "/app/potted_plants/potted_plants_works/order_to_internal_transport",
      //       );
      //     },
      //     subModuleName: "potted_plants_works_order_to_internal_transport",
      //   },
    ];
    pottedPlantsTrayOperationsSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<PottedPlantsSubmodules>(
        "potted_plants",
        navItem.subModuleName,
      );
      if (isActive) {
        pottedPlantsTrayOperationsSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });
    setPottedTrayOperationsPlantsSubNavigationState(
      pottedPlantsTrayOperationsSubNavigation,
    );
  }, []);

  return pottedPlantsTrayOperationsSubNavigationState;
};
