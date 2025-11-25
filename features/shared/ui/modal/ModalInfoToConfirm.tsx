import { View, Text } from "react-native";
import Button from "../button/Button";
import { InfoModal } from "../../types/interfaces-general";

type Props = {
  hideInfoConfirmationModal: () => void;
  infoModalDetails: InfoModal | null;
};

const ModalInfoToConfirm = (props: Props) => {
  ////vars
  const { infoModalDetails, hideInfoConfirmationModal } = props;

  if (!infoModalDetails) {
    return (
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative flex-col items-center justify-center flex-1">
          <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
            <View className="flex items-center justify-center w-full ">
              <Text className="text-center text-foreground font-euclid_semibold">
                Brak informacji do wyświetlenia.
              </Text>
            </View>

            <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
              <View>
                <Button
                  title="powrót"
                  handlePress={hideInfoConfirmationModal}
                  isOutline
                />
              </View>
              <View></View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const { info1, info2, confirmationButtonName, title } = infoModalDetails;

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
          <View className="flex items-center justify-center w-full ">
            <Text className="text-center text-foreground font-euclid_semibold">
              {title}
            </Text>
          </View>
          <View className="flex items-center justify-center w-full px-6 mt-2">
            <Text className="text-center text-foreground font-euclid_normal">
              {info1}
            </Text>
          </View>

          {info2 ? (
            <View className="flex items-center justify-center w-full px-6 mt-2">
              <Text className="text-center text-foreground font-euclid_normal">
                {info2}
              </Text>
            </View>
          ) : null}

          <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
            <View>
              <Button
                title={confirmationButtonName}
                handlePress={hideInfoConfirmationModal}
              />
            </View>

            <View></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ModalInfoToConfirm;
