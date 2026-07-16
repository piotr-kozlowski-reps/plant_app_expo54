import { useLayoutEffect, useState } from "react";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { PottedPlantsSubmodules } from "../types/interfaces-auth";
// import { SubNavigationElement } from "../types/interfaces-navigation";
// import { GreenhouseCropsSubmodule } from "../types/interfaces-auth";
import { router } from "expo-router";

export const useGetSubNavigationPottedPlantsElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [pottedPlantsSubNavigationState, setPottedPlantsSubNavigationState] =
    useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const pottedPlantsSubNavigation: SubNavigationElement[] = [];
    const pottedPlantsSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof PottedPlantsSubmodules;
    }[] = [
      {
        title: "Konfekcjonowanie",
        actionFn: () => {
          router.push("/app/potted_plants/potted_plants_works/packaging");
        },
        subModuleName: "potted_plants_works_packaging",
      },
      {
        title: "Transport wewnętrzny",
        actionFn: () => {
          router.push(
            "/app/potted_plants/potted_plants_works/internal_transport",
          );
        },
        subModuleName: "potted_plants_works_internal_transport",
      },
      {
        title: "Zabiegi chemiczne",
        actionFn: () => {
          router.push(
            "/app/potted_plants/potted_plants_works/chemical_treatments",
          );
        },
        subModuleName: "potted_plants_works_chemical_treatments",
      },
      {
        title: "Zlecenie transportu wewnętrznego",
        actionFn: () => {
          router.push(
            "/app/potted_plants/potted_plants_works/order_to_internal_transport",
          );
        },
        subModuleName: "potted_plants_works_order_to_internal_transport",
      },
    ];

    pottedPlantsSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<PottedPlantsSubmodules>(
        "potted_plants",
        navItem.subModuleName,
      );

      if (isActive) {
        pottedPlantsSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });

    setPottedPlantsSubNavigationState(pottedPlantsSubNavigation);
  }, []);

  return pottedPlantsSubNavigationState;
};
