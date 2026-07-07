import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import PottedPlants_PottedPlantsWorks_ChemicalTreatments_MainWindow from "./PottedPlants_PottedPlantsWorks_ChemicalTreatments_MainWindow";

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

  //   /**
  //    * @public
  //    * @procedureItem
  //    * raporty:
  //    * @readFile `features/shared/data-access/edocReport_ProtectiveTreatments.ts`
  //    */
  //   /**
  //    * @public
  //    * @procedureItem
  //    * raporty:
  //    * @readFile `features/shared/data-access/edocReport_NitrogenIrrigation.tsx`
  //    */
  //   /**
  //    * @public
  //    * @procedureItem
  //    * raporty:
  //    * @readFile `features/shared/data-access/edocReport_ExtraWorksNitrogenOnly.ts`
  //    */
  //   const {
  //     protectiveTreatments,
  //     zps_to_nitrogen_irrigation,
  //     extra_works,
  //     refreshAllData,
  //   } = useGetEdocReports({
  //     setIsLoading: setIsLoading,
  //     reports: [
  //       edocReport_ProtectiveTreatments,
  //       edocReport_NitrogenIrrigationList,
  //       edocReport_ExtraWorksNitrogenOnly,
  //     ],
  //   });
  //   const filteredOnlyNitrogenProtectiveTreatments: ProtectiveTreatment[] =
  //     filterOnlyNitrogenProtectiveTreatments(
  //       protectiveTreatments as ProtectiveTreatment[],
  //     );
  //   const extraWorksArray = extra_works as unknown as ExtraWork[];

  //   const refreshAllDataFn = refreshAllData as () => void;

  //   const nitrogenIrrigationList: ZpToNitrogenIrrigation[] =
  //     zps_to_nitrogen_irrigation as ZpToNitrogenIrrigation[];

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
        />

        {/* <NitrogenIrrigationMainWindow
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          protectiveTreatments={filteredOnlyNitrogenProtectiveTreatments}
          refreshAllData={refreshAllDataFn}
          nitrogenIrrigationList={nitrogenIrrigationList}
          extraWorks={extraWorksArray}
        /> */}
      </PermissionsOrGoFurther>
    </>
  );
};
export default PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage;
