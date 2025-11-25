import ExtraWorksQuantityEntryPage from "@/features/app/field_crops/extra_works_quantity/ui/ExtraWorksQuantityEntryPage";
import { IsHobbyParam } from "@/features/shared/types/interfaces-extra_works";
import { useLocalSearchParams } from "expo-router";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksQuantityPage = () => {
  ////vars
  const { ishobby } = useLocalSearchParams<{
    ishobby: IsHobbyParam;
  }>();

  ////tsx
  return (
    <>
      <ExtraWorksQuantityEntryPage isHobby={ishobby === "t" ? true : false} />
    </>
  );
};

export default ExtraWorksQuantityPage;
