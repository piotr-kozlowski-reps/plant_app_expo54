import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PottedPlants_PottedPlantsWorks_ChemicalTreatments_MainWindow from "./PottedPlants_PottedPlantsWorks_ChemicalTreatments_MainWindow";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ChemicalTreatmentsDon from "@/features/shared/data-access/edocReport_ChemicalTreatmentsDon";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import edocReport_ChemicalTreatmentsDonList from "@/features/shared/data-access/edocReport_ChemicalTreatmentsDonList";
import { ZpToChemicalTreatments } from "@/features/shared/types/interfaces-chemical_treatments_don";
import edocReport_ExtraWorksChemicalTreatmentsDon from "@/features/shared/data-access/edocReport_ExtraWorksChemicalTreatmentsDon";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";

/**
 * @public
 * @topic
 * @order 0
 * PROCEDURA:
 */

//TODO: finish that docs part
/**
 * @public
 * @procedureDescription
 * @order 1
 * <b>a)</b> zlecenie zabiegu chemicznego: ????????????TODO
 *      1. scan QR  lokalizacji/ ZPka
 *      2. formularz:
 *            - wybór stężenia
 *            - data zlecenia
 * <b>b)</b> potwierdzenie zabiegu chemicznego: ????????????TODO
 *      1. scan QR  lokalizacji/ ZPka
 *      2. formularz:
 *            - wybór stężenia
 */

const PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<PottedPlantsSubmodules>(
      "potted_plants",
      "potted_plants_works_chemical_treatments",
      "Zabiegi chemiczne",
    );
  //   const { filterOnlyNitrogenProtectiveTreatments } =
  //     useNitrogenProtectiveTreatmentsHelpers();

  //fetch
  /**
   * @public
   * @topic
   * @order 6
   * REALIZACJA:
   */

  /**
   * @public
   * @procedureItem
   * raporty:
   * @readFile `features/shared/data-access/edocReport_ChemicalTreatmentsDon.tsx`
   */
  /**
   * @public
   * @procedureItem
   * raporty:
   * @readFile `features/shared/data-access/edocReport_ChemicalTreatmentsDonList.tsx`
   */
  /**
   * @public
   * @procedureItem
   * raporty:
   * @readFile `features/shared/data-access/edocReport_ExtraWorksChemicalTreatmentsDon.tsx`
   */
  const {
    chemicalTreatmentsDon,
    zps_to_chemical_treatments_don,
    extra_works,
    refreshAllData,
  } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [
      edocReport_ChemicalTreatmentsDon,
      edocReport_ChemicalTreatmentsDonList,
      edocReport_ExtraWorksChemicalTreatmentsDon,
    ],
  });

  const chemicalTreatmentsDonArray =
    chemicalTreatmentsDon as unknown as ProtectiveTreatment[];
  const chemicalTreatmentsDonList: ZpToChemicalTreatments[] =
    zps_to_chemical_treatments_don as ZpToChemicalTreatments[];
  const extraWorksArray = extra_works as unknown as ExtraWork[];
  const refreshAllDataFn = refreshAllData as () => void;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <PottedPlants_PottedPlantsWorks_ChemicalTreatments_MainWindow
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          chemicalTreatmentsDon={chemicalTreatmentsDonArray}
          chemicalTreatmentsDonList={chemicalTreatmentsDonList}
          refreshAllData={refreshAllDataFn}
          extraWorks={extraWorksArray}
        />
      </PermissionsOrGoFurther>
    </>
  );
};
export default PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage;
