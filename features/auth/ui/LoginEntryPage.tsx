import { useState } from "react";
import { View, Text } from "react-native";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import LoginForm from "./LoginForm";

const LoginEntryPage = () => {
  //   ////vars
  const [isLoading, setIsLoading] = useState(false);

  ////tsx
  return (
    <>
      {isLoading ? <LoaderWholeScreen /> : null}

      <View className="items-center justify-center flex-1 py-6 pr-6">
        {/* <AppLogo /> */}
        <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
      </View>
    </>
  );
};

export default LoginEntryPage;
