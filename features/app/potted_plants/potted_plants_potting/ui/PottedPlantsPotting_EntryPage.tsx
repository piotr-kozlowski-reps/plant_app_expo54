import { Stack } from "expo-router";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import PottedPlantsPotting_MainWindow from "./PottedPlantsPotting_MainWindow";

/**
 * @public
 * @topic
 * @order 10
 * PROCEDURA:
 */

/**
 * @public
 * @procedureDescription
 * 1. Skan ZPka (dostępne tylko ZPki z końcówka '/DON')
 * 2. Podanie liczby doniczek
 * 3. Wykonanie zdjęć: min 1 max 20
 * 4. Wysyłka na serwer
 */

const PottedPlantsPotting_EntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<PottedPlantsSubmodules>(
      "potted_plants",
      "potted_plants_potting",
      "Doniczkowanie",
    );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <PottedPlantsPotting_MainWindow setIsLoading={setIsLoading} />
      </PermissionsOrGoFurther>
    </>
  );
};

export default PottedPlantsPotting_EntryPage;
