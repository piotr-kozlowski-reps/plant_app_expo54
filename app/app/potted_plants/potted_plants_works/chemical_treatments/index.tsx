import PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage from "@/features/app/potted_plants/potted_plants_works/chemical_treatments/ui/PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlants_PottedPlantsWorks_ChemicalTreatmentsPage = () => {
  return (
    <>
      <PottedPlants_PottedPlantsWorks_ChemicalTreatmentsEntryPage />
    </>
  );
};

export default PottedPlants_PottedPlantsWorks_ChemicalTreatmentsPage;
