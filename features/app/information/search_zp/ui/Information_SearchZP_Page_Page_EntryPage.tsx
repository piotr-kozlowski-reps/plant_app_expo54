import { InformationSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import InformationScanner from "../../ui/InformationScanner";

const Information_SearchZP_Page_Page_EntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<InformationSubmodules>(
      "information",
      "information_search_zp",
      "Wyszukaj ZP"
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <InformationScanner information_type="search_zp" />
      </PermissionsOrGoFurther>
    </>
  );
};
export default Information_SearchZP_Page_Page_EntryPage;
