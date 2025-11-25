import { Stack } from "expo-router";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { useCameraPermissions } from "expo-camera";
import OrdersAllScanner from "./OrdersAllScanner";
import { Localization } from "@/features/shared/types/interfaces-localization";
import { useMemo, useState } from "react";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import edocReport_AvailableLocalizations from "@/features/shared/data-access/edocReport_AvailableLocalizations";

type Props = {
  whatOrderType: AllCropsOrdersSubmodules;
};

const AllCropsOrdersAllEntryPage = (props: Props) => {
  ////vars
  const { whatOrderType } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  // const { submoduleName } = useGetOrderDetailsDependingOnType(whatOrderType);
  // const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
  //   useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
  //     "field_crops",
  //     whatOrderType,
  //     submoduleName
  //   );

  //TODO: handle permission

  //fetch data
  const { availableLocalizations, refreshAllData } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [edocReport_AvailableLocalizations],
  });
  const availableLocalizationsArray =
    availableLocalizations as unknown as Localization[];
  const filteredLocalizations: Localization[] = useMemo(() => {
    if (whatOrderType === "field_crops_works_order_to_hardener") {
      const foundFilteredLocalizations = availableLocalizationsArray.filter(
        (loc) => {
          return (
            Number.parseInt(loc.planam) >= 80 &&
            Number.parseInt(loc.planam) < 200
          );
        }
      );

      return foundFilteredLocalizations || [];
    }

    if (whatOrderType === "greenhouse_crops_works_order_to_spacing") {
      const foundFilteredLocalizations = availableLocalizationsArray.filter(
        (loc) => {
          return Number.parseInt(loc.planam) <= 80;
        }
      );

      return foundFilteredLocalizations || [];
    }

    return availableLocalizationsArray;
  }, [availableLocalizations, whatOrderType]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <OrdersAllScanner
          setIsLoading={setIsLoading}
          localizations={filteredLocalizations}
          refreshAllData={refreshAllData}
          whatOrderType={whatOrderType}
          isLoading={isLoading}
        />
      </PermissionsOrGoFurther>
    </>
  );
};

export default AllCropsOrdersAllEntryPage;
