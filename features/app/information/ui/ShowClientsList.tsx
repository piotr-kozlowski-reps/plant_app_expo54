import { ZpInProduction } from "@/features/shared/types/interfaces-zps_in_production";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";

type Props = {
  zpsWithUniqueClients: ZpInProduction[];
  isLoading: boolean;
  refreshAllData: () => void;
  setChosenClient: React.Dispatch<React.SetStateAction<ZpInProduction | null>>;
};

const ShowClientsList = (props: Props) => {
  const { zpsWithUniqueClients, isLoading, refreshAllData, setChosenClient } =
    props;

  // console.log({ zpsWithUniqueClients });

  return (
    <View className="flex-1 w-full px-6">
      <FlatList<ZpInProduction>
        data={zpsWithUniqueClients}
        renderItem={({ item }: { item: ZpInProduction }) => (
          <ListItemName
            title={item.glowny}
            subTitle={item.knt_akronim}
            subTitleName="akronim"
            id={item.sordid}
            actionFn={() => {
              setChosenClient(item);
            }}
          />
        )}
        refreshing={isLoading}
        onRefresh={refreshAllData}
        initialNumToRender={15}
      />
    </View>
  );
};
export default ShowClientsList;
