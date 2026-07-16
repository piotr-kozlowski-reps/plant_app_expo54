import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PottedPlantsPackagingScanner from "./PottedPlantsPackagingScanner";

/**
 * @public
 * @topic
 * @order 0
 * PROCEDURA:
 */

/**
 * @public
 * @procedureDescription
 * @order 1
 *      1. scan QR ZPka
 *      2. wysłanie potwierdzenia do API
 */

const PottedPlantsPackagingEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<PottedPlantsSubmodules>(
      "potted_plants",
      "potted_plants_works_packaging",
      "Konfekcjonowanie",
    );

  //fetch
  /**
   * @public
   * @topic
   * @order 6
   * REALIZACJA:
   */

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <PottedPlantsPackagingScanner setIsLoading={setIsLoading} />
      </PermissionsOrGoFurther>
    </>
  );
};
export default PottedPlantsPackagingEntryPage;
