import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PottedPlants_DisconnectFromZp_Scanner from "./PottedPlants_DisconnectFromZp_Scanner";

/**
 * @public
 * @topic
 * @order 10
 * PROCEDURA:
 */

/**
 * @public
 * @procedureDescription
 * 1. skan QR tacy
 * 2. potwierdzenie jej odpięcia od ZP
 */
export default function PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_EntryPage() {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<PottedPlantsSubmodules>(
      "potted_plants",
      "potted_plants_tray_operations_disconnect_from_zp",
      "Odepnij tacę",
    );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <PottedPlants_DisconnectFromZp_Scanner />
      </PermissionsOrGoFurther>
    </>
  );
}
