import { InformationSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import TechnologicalInformationScanner from "./TechnologicalInformationScanner";

const Information_TechnologicalInformation_EntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<InformationSubmodules>(
      "information",
      "technological_information",
      "Informacja technologiczna",
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <TechnologicalInformationScanner />
      </PermissionsOrGoFurther>
    </>
  );
};
export default Information_TechnologicalInformation_EntryPage;
