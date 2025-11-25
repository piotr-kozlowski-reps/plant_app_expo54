import { useLayoutEffect, useState } from "react";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { FieldCropsSubmodules } from "../types/interfaces-auth";
import { router } from "expo-router";

export const useGetSubNavigationFieldCropsElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [fieldCropsSubNavigationState, setFieldCropsSubNavigationState] =
    useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const fieldCropsSubNavigation: SubNavigationElement[] = [];
    const fieldCropsSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof FieldCropsSubmodules;
    }[] = [
      {
        title: "Cięcie GRU",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/cut");
        },
        subModuleName: "field_crops_works_cut",
      },
      {
        title: "Podlewanie azotem",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/nitrogen_irrigation");
        },
        subModuleName: "field_crops_nitrogen_irrigation",
      },
      {
        title: "Prognoza załadunku",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/loading_forecast");
        },
        subModuleName: "field_crops_works_loading_forecast",
      },
      {
        title: "Przeliczanie wschodów",
        actionFn: () => {
          router.push(
            "/app/field_crops/field_crops_works/plants_coming_ups_counter"
          );
        },
        subModuleName: "field_crops_works_plants_coming_ups_counter",
      },
      {
        title: "Transport wewnętrzny",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/internal_transport");
        },
        subModuleName: "field_crops_works_internal_transport",
      },

      {
        title: "Zabieg ochronny",
        actionFn: () => {
          router.push(
            "/app/field_crops/field_crops_works/protective_treatment"
          );
        },
        subModuleName: "field_crops_works_protective_treatment",
      },

      {
        title: "Załadunek",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/loading");
        },
        subModuleName: "field_crops_works_loading",
      },

      {
        title: "Zlecenie na hartownik",
        actionFn: () => {
          router.push("/app/field_crops/field_crops_works/order_to_hardener");
        },
        subModuleName: "field_crops_works_order_to_hardener",
      },
      {
        title: "Zlecenie transportu wewnętrznego",
        actionFn: () => {
          router.push(
            "/app/field_crops/field_crops_works/order_to_internal_transport"
          );
        },
        subModuleName: "field_crops_works_order_to_internal_transport",
      },
      {
        title: "Zlecenie wywozu do klienta",
        actionFn: () => {
          router.push(
            "/app/field_crops/field_crops_works/order_export_to_customer"
          );
        },
        subModuleName: "field_crops_works_order_export_to_customer",
      },
    ];

    fieldCropsSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<FieldCropsSubmodules>(
        "field_crops",
        navItem.subModuleName
      );

      if (isActive) {
        fieldCropsSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });

    setFieldCropsSubNavigationState(fieldCropsSubNavigation);
  }, []);

  return fieldCropsSubNavigationState;
};
