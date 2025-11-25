import { View } from "react-native";
import Button from "../button/Button";
import { PermissionResponse } from "expo-camera";

type Props = {
  isPermissionGranted: boolean;
  children: React.ReactNode;
  requestPermission: () => Promise<PermissionResponse>;
};

const PermissionsOrGoFurther = (props: Props) => {
  ////vars
  const { isPermissionGranted, requestPermission, children } = props;

  ////tsx
  return (
    <View className="items-center justify-center w-full h-full bg-yellow">
      {/* no permissions */}
      {!isPermissionGranted ? (
        <View>
          <Button title="Udziel pozwolenia" handlePress={requestPermission} />
        </View>
      ) : null}

      {/* permission granted */}
      {isPermissionGranted ? <>{children}</> : null}
    </View>
  );
};
export default PermissionsOrGoFurther;
