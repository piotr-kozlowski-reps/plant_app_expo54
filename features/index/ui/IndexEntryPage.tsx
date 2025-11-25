import { View } from "react-native";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useFocusEffect, router } from "expo-router";

import { BadgeInfo, House, Menu, Shovel, Sprout } from "lucide-react-native";
import {
  darkColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import MainMenuModal from "./MainMenuModal";
import ButtonIconWithCustomSize from "@/features/shared/ui/button/ButtonIconWithCustomSize";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";

const IndexEntryPage = () => {
  ////vars
  const { isLoggedIn, getModuleVisibility } = useAuthSessionStore();
  const [isShowMainMenuModal, setIsShowMainMenuModal] = useShowModal(false);

  useFocusEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  });

  ////tsx
  return (
    <View className="relative w-full h-full">
      <MainMenuModal
        isOpen={isShowMainMenuModal}
        closeFn={() => setIsShowMainMenuModal(false)}
      />

      <SafeAreaView className="items-center justify-center flex-1 gap-2 px-6 mt-[80px]">
        <View className="flex-row items-center justify-center w-full gap-2">
          <LeafNavigationButton
            side={"left"}
            actionFn={
              getModuleVisibility("information")
                ? () => {
                    router.push("/app/information");
                  }
                : () => {}
            }
            icon={
              <BadgeInfo size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`Informacja`}
            disabled={!getModuleVisibility("information")}
          />
          <LeafNavigationButton
            side={"right"}
            actionFn={
              getModuleVisibility("field_crops")
                ? () => {
                    router.push("/app/field_crops");
                  }
                : () => {}
            }
            icon={
              <Sprout size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`Rozsady${"\n"}gruntowe`}
            disabled={!getModuleVisibility("field_crops")}
          />

          {/* <LeafNavigationButton
            side={"right"}
            actionFn={() => {}}
            icon={
              <House size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`uprawy${"\n"}szklarniowe`}
            visibility={false}
          /> */}
        </View>

        {/* <View className="flex-row items-center justify-center w-full gap-2">
   
            <LeafNavigationButton
              side={"left"}
              actionFn={() => {}}
              icon={
                <DoorOpen
                  size={24}
                  color={lightNuanceColor}
                  strokeWidth={2.7}
                />
              }
              name="portiernia"
              disabled
            />
          )}
        </View> */}

        <View className="flex-row items-center justify-center w-full gap-2">
          <LeafNavigationButton
            side={"left"}
            actionFn={
              getModuleVisibility("greenhouse_crops")
                ? () => {
                    router.push("/app/greenhouse_crops");
                  }
                : () => {}
            }
            icon={
              <House size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`Uprawy${"\n"}szklarniowe`}
            // disabled={!getModuleVisibility("greenhouse_crops")}
            visibility={getModuleVisibility("greenhouse_crops")}
          />
          <LeafNavigationButton
            side={"right"}
            actionFn={
              getModuleVisibility("general_works")
                ? () => {
                    router.push("/app/general_works");
                  }
                : () => {}
            }
            icon={
              <Shovel size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`Prace ogólne`}
            disabled={!getModuleVisibility("general_works")}
          />
        </View>

        {/* 
          <LeafNavigationButton
            side={"right"}
            actionFn={
              getModuleVisibility("tray_operations")
                ? () => {
                    router.push("/app/tray_operations");
                  }
                : () => {}
            }
            icon={
              <Grid3x3 size={24} color={lightNuanceColor} strokeWidth={2.7} />
            }
            name={`Operacje${"\n"}na tacach`}
            disabled={!getModuleVisibility("tray_operations")}
          />
        </View> */}
      </SafeAreaView>

      <View className="absolute top-16 left-6">
        <ButtonIconWithCustomSize
          actionFn={() => setIsShowMainMenuModal(true)}
          icon={<Menu size={24} color={darkColor} />}
          size={62}
        />

        {/* <ButtonIcon
          handlePress={() => setIsShowMainMenuModal(true)}
          icon={<Menu size={24} color={darkColor} style={{ marginLeft: -2 }} />}
          isOnlyIcon
        /> */}
      </View>
    </View>
  );
};

export default IndexEntryPage;
