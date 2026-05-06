import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { HobbyCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import { INDEX } from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileDigit, LeafyGreen, Pickaxe } from "lucide-react-native";

const HobbyCropsCropsEntryPage = () => {
  ////vars
  const { getModuleVisibilitiesObject } = useAuthSessionStore();

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full bg-yellow">
        <SafeAreaView className="items-center justify-center flex-1 gap-2">
          <View className="flex-col items-center justify-between flex-1 w-full mt-8">
            <View className="w-full px-6">
              <AppPath
                paths={[INDEX, { name: "Rozsady Hobby", actionFn: () => {} }]}
              />
            </View>

            <View className="flex-col items-center gap-2 px-6 mt-8">
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_technology
                      ? () => {
                          router.push(
                            "/app/hobby_crops/extra_works_hobby_technology",
                          );
                        }
                      : () => {}
                  }
                  icon={
                    <LeafyGreen
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Prace HOBBY`}
                  disabled={
                    !getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_technology
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_zp
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_zp?ishobby=t",
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
                    !getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_zp
                  }
                  visibility={false}
                />
              </View>
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_quantity
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_quantity?ishobby=t",
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
                    !getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_quantity
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_zp
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_zp?ishobby=t",
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
                    !getModuleVisibilitiesObject<HobbyCropsSubmodules>(
                      "hobby_crops",
                    ).hobby_crops_extra_works_zp
                  }
                />
              </View>
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
export default HobbyCropsCropsEntryPage;
