import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { InformationSubmodules } from "@/features/shared/types/interfaces-auth";
import { Stack } from "expo-router";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import InformationScanner from "../../ui/InformationScanner";

const Information_ScanZP_Page_EntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<InformationSubmodules>(
      "information",
      "information_scan_zp",
      "Skanuj ZP"
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <InformationScanner information_type="scan_zp" />
      </PermissionsOrGoFurther>
    </>
  );
};
export default Information_ScanZP_Page_EntryPage;
