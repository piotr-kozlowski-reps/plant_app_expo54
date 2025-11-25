import { useLayoutEffect, useState } from "react";
import { SubNavigationElement } from "../types/interfaces-navigation";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { GeneralWorksSubmodules } from "../types/interfaces-auth";
import { router } from "expo-router";

export const useGetSubNavigationGeneralWorksElements = () => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const [generalWorksSubNavigationState, setGeneralWorksSubNavigationState] =
    useState<SubNavigationElement[]>([]);

  useLayoutEffect(() => {
    const generalWorksSubNavigation: SubNavigationElement[] = [];
    const generalWorksSubNavigationAllElements: {
      title: string;
      actionFn: () => void;
      subModuleName: keyof GeneralWorksSubmodules;
    }[] = [
      {
        title: "Podlewanie roślin",
        actionFn: () => {
          router.push("/app/general_works/watering_plants");
        },
        subModuleName: "watering_plants",
      },
    ];
    generalWorksSubNavigationAllElements.forEach((navItem) => {
      const isActive = getSubmodulePermission<GeneralWorksSubmodules>(
        "general_works",
        navItem.subModuleName
      );
      if (isActive) {
        generalWorksSubNavigation.push({
          title: navItem.title,
          actionFn: navItem.actionFn,
        });
      }
    });
    setGeneralWorksSubNavigationState(generalWorksSubNavigation);
  }, []);

  return generalWorksSubNavigationState;
};
