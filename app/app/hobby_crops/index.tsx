import HobbyCropsCropsEntryPage from "@/features/app/hobby_crops/ui/HobbyCropsCropsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const HobbyCropsPage = () => {
  return (
    <>
      <HobbyCropsCropsEntryPage />
    </>
  );
};

export default HobbyCropsPage;
