import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import SubNavigation from "@/features/shared/ui/sub-navigaton/ui/SubNavigation";
import {
  FIELD_CROPS,
  INDEX,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";

import { useGetSubNavigationFieldCropsElements } from "@/features/shared/utils/useGetSubNavigationFieldCropsElements";
import { Stack } from "expo-router";

const FieldCropsEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  ////sub navigation items with checked permissions
  const fieldCropsSubNavigation: SubNavigationElement[] =
    useGetSubNavigationFieldCropsElements();

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("field_crops")
  );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}

        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[
              INDEX,
              FIELD_CROPS,
              { name: "Rozsady gruntowe - prace", actionFn: () => {} },
            ]}
            subNavigationItems={fieldCropsSubNavigation}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default FieldCropsEntryPage;
