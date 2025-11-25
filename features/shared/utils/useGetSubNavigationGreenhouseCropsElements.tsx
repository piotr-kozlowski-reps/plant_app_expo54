import { useLayoutEffect, useState } from "react";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { GreenhouseCropsSubmodule } from "../types/interfaces-auth";
import { router } from "expo-router";

export const useGetSubNavigationGreenhouseCropsElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [
    greenhouseCropsSubNavigationState,
    setGreenhouseCropsSubNavigationState,
  ] = useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const greenhouseCropsSubNavigation: SubNavigationElement[] = [];
    const greenhouseCropsSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof GreenhouseCropsSubmodule;
    }[] = [
      {
        title: "Planowanie prac - ogórek",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/works_planning_cucumber"
          );
        },
        subModuleName: "greenhouse_crops_works_works_planning_cucumber",
      },

      {
        title: "Planowanie prac - pomidor",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/works_planning_tomato"
          );
        },
        subModuleName: "greenhouse_crops_works_works_planning_tomato",
      },
      {
        title: "Potwierdzanie czynności - ogórek",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/actions_confirmation_cucumber"
          );
        },
        subModuleName: "greenhouse_crops_works_actions_confirmation_cucumber",
      },
      {
        title: "Potwierdzanie czynności - pomidor",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/actions_confirmation_tomato"
          );
        },
        subModuleName: "greenhouse_crops_works_actions_confirmation_tomato",
      },

      {
        title: "Prognoza załadunku",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/loading_forecast"
          );
        },
        subModuleName: "greenhouse_crops_works_loading_forecast",
      },
      {
        title: "Transport wewnętrzny",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/internal_transport"
          );
        },
        subModuleName: "greenhouse_crops_works_internal_transport",
      },
      // {
      //   title: "Zlecenie rozstawiania",
      //   actionFn: () => {
      //     router.push(
      //       "/app/greenhouse_crops/greenhouse_crops_works/order_to_spacing"
      //     );
      //   },
      //   subModuleName: "greenhouse_crops_works_order_to_spacing",
      // },
      {
        title: "Zlecenie wywozu do klienta",
        actionFn: () => {
          router.push(
            "/app/greenhouse_crops/greenhouse_crops_works/order_export_to_customer"
          );
        },
        subModuleName: "greenhouse_crops_works_order_export_to_customer",
      },
    ];

    greenhouseCropsSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<GreenhouseCropsSubmodule>(
        "greenhouse_crops",
        navItem.subModuleName
      );

      if (isActive) {
        greenhouseCropsSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });

    setGreenhouseCropsSubNavigationState(greenhouseCropsSubNavigation);
  }, []);

  return greenhouseCropsSubNavigationState;
};
