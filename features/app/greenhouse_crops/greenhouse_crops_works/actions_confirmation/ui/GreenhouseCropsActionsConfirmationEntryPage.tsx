import { GreenhouseCropsSubmodule } from "@/features/shared/types/interfaces-auth";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import GreenhouseCropsActionsConfirmationScanner from "./GreenhouseCropsActionsConfirmationScanner";
import { ActivityVariant } from "@/features/shared/types/interfaces-activities_list";

type Props = {
  variant: ActivityVariant;
};

const GreenhouseCropsActionsConfirmationEntryPage = (props: Props) => {
  ////vars
  const { variant } = props;
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<GreenhouseCropsSubmodule>(
      "greenhouse_crops",
      variant === "greenhouse_crops_works_activity_confirmation_tomato"
        ? "greenhouse_crops_works_actions_confirmation_tomato"
        : "greenhouse_crops_works_actions_confirmation_cucumber",
      variant === "greenhouse_crops_works_activity_confirmation_tomato"
        ? "Potwierdzanie czynności - pomidor"
        : "Potwierdzanie czynności - ogórek"
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <GreenhouseCropsActionsConfirmationScanner variant={variant} />
      </PermissionsOrGoFurther>
    </>
  );
};

export default GreenhouseCropsActionsConfirmationEntryPage;
