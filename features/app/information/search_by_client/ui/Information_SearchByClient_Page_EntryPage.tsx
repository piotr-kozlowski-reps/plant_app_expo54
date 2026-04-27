import { InformationSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import InformationScanner from "../../ui/InformationScanner";

/**
 * @public
 * @topic
 * PROCEDURA:
 */

/**
 * @public
 * @procedureDescription
 * 1. wyszukaj klienta z listy
 * 2. wyszukaj ZP'ka z listy ZP'ków klienta
 */

const Information_SearchByClient_Page_EntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<InformationSubmodules>(
      "information",
      "information_search_by_client",
      "Wyszukaj po kliencie",
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <InformationScanner information_type="search_by_client" />
      </PermissionsOrGoFurther>
    </>
  );
};
export default Information_SearchByClient_Page_EntryPage;
