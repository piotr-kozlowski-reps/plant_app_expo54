import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import {
  FIELD_CROPS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { router, Stack } from "expo-router";
import { FileDigit, Pickaxe } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExtraWorksHobbyEntryPage = () => {
  ////vars
  const { getModuleVisibility, getModuleVisibilitiesObject } =
    useAuthSessionStore();

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full bg-yellow">
        <SafeAreaView className="items-center justify-center flex-1 gap-2">
          <View className="flex-col items-center justify-between flex-1 w-full mt-8">
            <View className="w-full px-6">
              <AppPath
                paths={[
                  INDEX,
                  FIELD_CROPS,
                  { name: "Prace Hobby", actionFn: () => {} },
                ]}
              />
            </View>

            <View className="flex-row items-center justify-center flex-1 w-full gap-2 px-6">
              <LeafNavigationButton
                side={"left"}
                actionFn={
                  getModuleVisibilitiesObject<FieldCropsSubmodules>(
                    "field_crops"
                  ).extra_works_hobby_extra_works_quantity
                    ? () => {
                        router.push(
                          "/app/field_crops/extra_works_quantity?ishobby=t"
                        );
                      }
                    : () => {}
                }
                icon={
                  <FileDigit
                    size={24}
                    color={lightNuanceColor}
                    strokeWidth={2.7}
                  />
                }
                name={`Prace${"\n"}Hobby - Ilości`}
                disabled={
                  !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                    "field_crops"
                  ).extra_works_hobby_extra_works_quantity
                }
              />
              <LeafNavigationButton
                side={"right"}
                actionFn={
                  getModuleVisibilitiesObject<FieldCropsSubmodules>(
                    "field_crops"
                  ).extra_works_hobby_extra_works_zp
                    ? () => {
                        router.push(
                          "/app/field_crops/extra_works_zp?ishobby=t"
                        );
                      }
                    : () => {}
                }
                icon={
                  <Pickaxe
                    size={24}
                    color={lightNuanceColor}
                    strokeWidth={2.7}
                  />
                }
                name={`Prace${"\n"}Hobby - ZP`}
                disabled={
                  !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                    "field_crops"
                  ).extra_works_hobby_extra_works_zp
                }
              />
            </View>
            <View className="w-full mb-6">
              <ButtonBack isOutline={false} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};
export default ExtraWorksHobbyEntryPage;
