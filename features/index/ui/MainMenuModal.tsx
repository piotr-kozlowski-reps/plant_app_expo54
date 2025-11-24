import { View } from "react-native";
import { router } from "expo-router";
import {
  darkColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, LogOut } from "lucide-react-native";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useRemoveCredentialsFromSecureStore } from "../domain/useRemoveCredentialsFromSecureStore";
import ButtonIconWithCustomSize from "@/features/shared/ui/button/ButtonIconWithCustomSize";
import MenuNavButton from "@/features/shared/ui/button/MenuNavButton";

type TProps = {
  isOpen: boolean;
  closeFn: () => void;
};

const MainMenuModal = (props: TProps) => {
  ////vars
  const { isOpen, closeFn } = props;
  const { removeAuthSession } = useAuthSessionStore();
  const { removeCredentialsFromSecureStore } =
    useRemoveCredentialsFromSecureStore();

  //LogOut
  const logoutHandler = async () => {
    router.replace("/login");
    await removeCredentialsFromSecureStore();
    removeAuthSession();
  };

  //closeFn
  const closeHandler = () => {
    closeFn();
  };

  ////tsx
  return (
    <>
      {isOpen ? (
        <Animated.View
          className="absolute top-0 left-0 right-0 z-20 w-full h-full"
          entering={SlideInLeft.duration(100).damping(11)}
          exiting={SlideOutLeft.duration(200)}
        >
          <StatusBar backgroundColor={yellowColor} style="dark" />

          <View className="relative w-full h-full bg-yellow">
            {/* <View className="w-32 h-32 mt-16 bg-blue-300"></View> */}

            <View className="flex-col items-start justify-center h-full pl-6">
              <MenuNavButton
                title="Wyloguj się"
                handlePress={logoutHandler}
                icon={<LogOut size={24} color={darkColor} strokeWidth={2.5} />}
              />
            </View>

            <View className="absolute z-50 top-16 left-6">
              <ButtonIconWithCustomSize
                actionFn={closeHandler}
                icon={<ChevronLeft size={24} color={darkColor} />}
                size={62}
              />
            </View>
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};

export default MainMenuModal;
