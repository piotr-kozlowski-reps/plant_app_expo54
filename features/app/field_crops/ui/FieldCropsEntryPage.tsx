import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FIELD_CROPS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { router } from "expo-router";
import {
  FileDigit,
  Grid3x3,
  Pickaxe,
  ShoppingBag,
  Sprout,
} from "lucide-react-native";
import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const FieldCropsEntryPage = () => {
  ////vars
  const { getModuleVisibilitiesObject } = useAuthSessionStore();

  ////tsx
  return (
    <>
      <View className="relative w-full h-full bg-yellow">
        <SafeAreaView className="items-center justify-center flex-1 gap-2">
          <View className="flex-col items-center justify-between flex-1 w-full mt-8">
            <View className="w-full px-6">
              <AppPath
                paths={[
                  INDEX,
                  { name: "Rozsady gruntowe", actionFn: () => {} },
                ]}
              />
            </View>

            <View className="flex-col items-center gap-2 px-6 mt-16">
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).field_crops_works___overallVisibility
                      ? () => {
                          router.push("/app/field_crops/field_crops_works");
                        }
                      : () => {}
                  }
                  icon={
                    <Sprout
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Rozsady${"\n"}gruntowe - prace`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).field_crops_works___overallVisibility
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_quantity___overallVisibility
                      ? () => {
                          router.push("/app/field_crops/extra_works_quantity");
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
                  name={`Prace${"\n"}Extra GRU - Ilości`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_quantity___overallVisibility
                  }
                />
              </View>
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_zp___overallVisibility
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_zp?ishobby=f"
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
                  name={`Prace${"\n"}Extra GRU - ZP`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_zp___overallVisibility
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_hobby___overallVisibility
                      ? () => {
                          router.push("/app/field_crops/extra_works_hobby");
                        }
                      : () => {}
                  }
                  icon={
                    <ShoppingBag
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Prace${"\n"}Hobby`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_hobby___overallVisibility
                  }
                />
              </View>

              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_zp___overallVisibility
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_zp?ishobby=f"
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
                  name={`Prace${"\n"}Extra GRU - ZP`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).extra_works_zp___overallVisibility
                  }
                  visibility={false}
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).tray_operations___overallVisibility
                      ? () => {
                          router.push("/app/field_crops/tray_operations");
                        }
                      : () => {}
                  }
                  icon={
                    <Grid3x3
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Operacje${"\n"}na tacach`}
                  disabled={
                    !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                      "field_crops"
                    ).tray_operations___overallVisibility
                  }
                />
              </View>
            </View>

            <View className="w-full mb-6">
              <ButtonBack isOutline={false} />
            </View>
          </View>
        </SafeAreaView>

        <View className="absolute top-16 left-6"></View>
      </View>
    </>
  );
};

export default FieldCropsEntryPage;
