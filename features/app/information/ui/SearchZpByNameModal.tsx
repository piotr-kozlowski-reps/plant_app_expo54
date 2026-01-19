import edocReport_ZPsInProduction from "@/features/shared/data-access/edocReport_ZPsInProduction";
import {
  INDEX,
  INFORMATION,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import InputText from "@/features/shared/ui/input/InputText";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { View, Text } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { FlatList } from "react-native-gesture-handler";
import { ZpInProduction } from "@/features/shared/types/interfaces-zps_in_production";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/features/shared/data-access/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useGetZPsInProduction } from "@/features/shared/data-access/useGetZPsInProduction";

type Props = {
  closeFn: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  findInfoAboutSearchedZp: (ordnmb: string) => void;
};

const SearchZpByNameModal = (props: Props) => {
  ////vars
  const { closeFn, isLoading, setIsLoading, findInfoAboutSearchedZp } = props;
  const getZPsInProduction = useGetZPsInProduction();

  // //fetch data
  // const { ZPsInProduction, refreshAllData } = useGetEdocReports({
  //   setIsLoading: setIsLoading,
  //   reports: [edocReport_ZPsInProduction],
  // });
  // const ZPsInProductionArray = useMemo(() => {
  //   return ZPsInProduction as unknown as ZpInProduction[];
  // }, [ZPsInProduction]);

  // fetch data
  const { data: ZPsInProductionBaseArray } = useQuery<ZpInProduction[]>({
    queryKey: ["ZPsInProduction"],
    queryFn: () => getZPsInProduction(),
  });
  const ZPsInProductionArray = useMemo(
    () => (ZPsInProductionBaseArray ? ZPsInProductionBaseArray : []),
    [ZPsInProductionBaseArray],
  );
  const refreshAllData = () => {};

  console.log({ ZPsInProductionBaseArray });
  console.log({ ZPsInProductionArray });

  // //search
  const [searchText, setSearchText] = useState("");
  const updateSearchText = (text: string) => {
    setSearchText(text);
  };
  // const debouncedSearchText = useDebounce(searchText, 500);

  // //filtered zps in production
  // const [filteredZPsInProduction, setFilteredZPsInProduction] =
  //   useState<ZpInProduction[]>(ZPsInProductionArray);
  // useEffect(() => {
  //   if (!debouncedSearchText) {
  //     setFilteredZPsInProduction([...ZPsInProductionArray]);
  //   }

  //   if (debouncedSearchText) {
  //     const filteredData = ZPsInProductionArray.filter((zp) => {
  //       return zp.ordnmb
  //         .toLocaleLowerCase()
  //         .includes(debouncedSearchText.toLocaleLowerCase());
  //     });
  //     setFilteredZPsInProduction(filteredData);
  //   }
  // }, [debouncedSearchText]);

  //

  ////tsx
  return (
    <>
      {isLoading ? <LoaderWholeScreen /> : null}

      <View className="absolute bottom-0 left-0 right-0 w-full top-8">
        <KeyboardAwareScrollView
          bottomOffset={61}
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
        >
          <View className="flex-1 w-full bg-yellow">
            <View className="w-full px-6 mt-4">
              <AppPath
                paths={[
                  INDEX,
                  INFORMATION,
                  { actionFn: () => {}, name: "Wyszukaj ZP" },
                ]}
              />
            </View>

            <View className="w-full h-6 opacity-35"></View>

            <View className="px-6">
              <InputText
                value={searchText}
                placeholder="wpisz wyszukiwany ciąg znaków"
                onChangeText={updateSearchText}
                label="Wyszukaj zlecenie"
              />
            </View>

            <View className="flex items-center justify-center w-full">
              <View className="h-[1px] w-16 bg-foreground mt-6"></View>
            </View>

            {/* <View className="w-full pl-6 mt-4">
              <Text className="mb-2 font-default-semibold text-background-nuance">
                Zlecenia produkcyjne - (ilość: {filteredZPsInProduction.length}
                ):
              </Text>
            </View> */}

            <View className="flex-1 w-full px-6">
              <FlatList<ZpInProduction>
                // data={filteredZPsInProduction}
                data={ZPsInProductionArray}
                renderItem={({ item }: { item: ZpInProduction }) => (
                  <ListItemName
                    title={item.ordnmb}
                    id={item.sordid}
                    actionFn={() => {
                      findInfoAboutSearchedZp(item.ordnmb);
                      closeFn();
                    }}
                  />
                )}
                refreshing={isLoading}
                onRefresh={refreshAllData}
                initialNumToRender={15}
              />
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1"></View>
              <View className="ml-6">
                <ButtonBack isOutline={false} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} />
      </View>
    </>
  );
};
export default SearchZpByNameModal;
