import { View } from "react-native";
import { Stack } from "expo-router";
import { useGetSubNavigationPottedPlantsElements } from "@/features/shared/utils/useGetSubNavigationPottedPlantsElements";
import {
  INDEX,
  POTTED_PLANTS,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { SafeAreaView } from "react-native-safe-area-context";
import SubNavigation from "@/features/shared/ui/sub-navigaton/ui/SubNavigation";

const PottedPlantsWorks_EntryPage = () => {
  ////sub navigation items with checked permissions
  const pottedPlantsSubNavigationState: SubNavigationElement[] =
    useGetSubNavigationPottedPlantsElements();

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("potted_plants"),
  );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full">
        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[
              INDEX,
              POTTED_PLANTS,
              { name: "Rośliny doniczkowe - prace", actionFn: () => {} },
            ]}
            subNavigationItems={pottedPlantsSubNavigationState}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default PottedPlantsWorks_EntryPage;
