import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { View, Text } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import {
  INDEX,
  INFORMATION,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ZPsInProduction from "@/features/shared/data-access/edocReport_ZPsInProduction";
import { useEffect, useMemo, useRef, useState } from "react";
import { ZpInProduction } from "@/features/shared/types/interfaces-zps_in_production";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import InputText from "@/features/shared/ui/input/InputText";
import ShowClientsList from "./ShowClientsList";
import { useDebounce } from "@/features/shared/data-access/useDebounce";
import { FlatList } from "react-native-gesture-handler";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import Button from "@/features/shared/ui/button/Button";
import { useQuery } from "@tanstack/react-query";
import { useGetZPsInProduction } from "@/features/shared/data-access/useGetZPsInProduction";

type Props = {
  closeFn: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  findInfoAboutSearchedZp: (ordnmb: string) => void;
};

const SearchZpByClientModal = (props: Props) => {
  ////vars
  const { closeFn, isLoading, setIsLoading, findInfoAboutSearchedZp } = props;
  const getZPsInProduction = useGetZPsInProduction();

  // fetch data
  const { data: ZPsInProductionBaseArray } = useQuery<ZpInProduction[]>({
    queryKey: ["ZPsInProduction"],
    queryFn: () => getZPsInProduction(),
  });
  const ZPsInProductionArray = useMemo(
    () => (ZPsInProductionBaseArray ? ZPsInProductionBaseArray : []),
    [ZPsInProductionBaseArray]
  );
  const refreshAllData = () => {};
  // const { ZPsInProduction, refreshAllData } = useGetEdocReports({
  //   setIsLoading: setIsLoading,
  //   reports: [edocReport_ZPsInProduction],
  // });

  // const ZPsInProductionArray = useMemo(() => {
  //   return ZPsInProduction as unknown as ZpInProduction[];
  // }, [ZPsInProduction]);

  ////
  ////
  //clients
  const [chosenClient, setChosenClient] = useState<ZpInProduction | null>(null);
  const [zpsWithUniqueClients, setZpsWithUniqueClients] = useState<
    ZpInProduction[]
  >([]);
  // const isClientsCreated = useRef(false);
  useEffect(() => {
    const zpUniqueDueToClients = new Set<string>();
    ZPsInProductionArray.forEach((zp) => {
      zpUniqueDueToClients.add(zp.glowny);
    });

    const clientsArray = Array.from(zpUniqueDueToClients);

    const zpsList: ZpInProduction[] = [];
    clientsArray.forEach((client) => {
      const foundZP = ZPsInProductionArray.find((zp) => zp.glowny === client);
      if (foundZP) {
        zpsList.push(foundZP);
      }
    });

    setZpsWithUniqueClients(zpsList);
    // isClientsCreated.current = true;
  }, [ZPsInProductionArray]);
  const [searchTextClient, setSearchTextClient] = useState("");
  const updateSearchTextClient = (text: string) => {
    setSearchTextClient(text);
  };

  const debouncedSearchTextClients = useDebounce(searchTextClient, 500);
  const [filteredClients, setFilteredClients] = useState<ZpInProduction[]>([]);
  useEffect(() => {
    if (!debouncedSearchTextClients) {
      setFilteredClients([...zpsWithUniqueClients]);
    }

    if (debouncedSearchTextClients) {
      const filteredData = zpsWithUniqueClients.filter((zp) => {
        return (
          zp.glowny
            .toLocaleLowerCase()
            .includes(debouncedSearchTextClients.toLocaleLowerCase()) ||
          zp.knt_akronim
            .toLocaleLowerCase()
            .includes(debouncedSearchTextClients.toLocaleLowerCase())
        );
      });
      setFilteredClients(filteredData);
    }
  }, [debouncedSearchTextClients, zpsWithUniqueClients]);

  ////
  ////
  ////search zp
  const [searchText, setSearchText] = useState("");
  const updateSearchText = (text: string) => {
    setSearchText(text);
  };
  const debouncedSearchText = useDebounce(searchText, 500);

  //filtered zps in production
  const [filteredZPsInProductionByClient, setFilteredZPsInProductionByClient] =
    useState<ZpInProduction[]>(ZPsInProductionArray);
  useEffect(() => {
    const currentFilteredZPs: ZpInProduction[] = [];

    if (chosenClient) {
      ZPsInProductionArray.forEach((zp) => {
        if (zp.glowny === chosenClient.glowny) {
          currentFilteredZPs.push(zp);
        }
      });
    }

    setFilteredZPsInProductionByClient(currentFilteredZPs);
  }, [chosenClient]);

  useEffect(() => {
    const filteredZpByChosenClient = ZPsInProductionArray.filter((zp) => {
      return (
        zp.glowny
          .toLocaleLowerCase()
          .includes(debouncedSearchText.toLocaleLowerCase()) ||
        zp.knt_akronim
          .toLocaleLowerCase()
          .includes(debouncedSearchText.toLocaleLowerCase())
      );
    });
    if (!debouncedSearchText) {
      setFilteredZPsInProductionByClient(filteredZpByChosenClient);
    }

    if (debouncedSearchText) {
      const filteredData = filteredZpByChosenClient.filter((zp) => {
        return zp.ordnmb
          .toLocaleLowerCase()
          .includes(debouncedSearchText.toLocaleLowerCase());
      });
      setFilteredZPsInProductionByClient(filteredData);
    }
  }, [debouncedSearchText]);

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
                  { actionFn: () => {}, name: "Wyszukaj po kliencie" },
                ]}
              />
            </View>

            <View className="w-full h-6 opacity-35"></View>

            {!chosenClient ? (
              <>
                <View className="px-6">
                  <InputText
                    value={searchTextClient}
                    placeholder="wpisz wyszukiwany ciąg znaków"
                    onChangeText={updateSearchTextClient}
                    label="Wyszukaj klienta"
                  />
                </View>

                <View className="flex items-center justify-center w-full">
                  <View className="h-[1px] w-16 bg-foreground mt-6"></View>
                </View>

                <View className="w-full pl-6 mt-4">
                  <Text className="mb-2 font-default-semibold text-background-nuance">
                    Klienci - (ilość: {filteredClients.length}
                    ):
                  </Text>
                </View>

                <ShowClientsList
                  zpsWithUniqueClients={filteredClients}
                  isLoading={isLoading}
                  refreshAllData={refreshAllData}
                  setChosenClient={setChosenClient}
                />
              </>
            ) : null}

            {chosenClient ? (
              <>
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

                <View className="flex-row items-center justify-between pr-6">
                  <View className="">
                    <View className="pl-6 mt-4">
                      <Text className="mb-2 font-default-normal text-background-nuance">
                        Klient:{" "}
                        <Text className="mb-2 font-default-semibold text-background-nuance">
                          {chosenClient.glowny}
                        </Text>
                      </Text>
                    </View>
                    <View className="pl-6 -mt-2">
                      <Text className="mb-2 font-default-semibold text-background-nuance">
                        Zlecenia - (ilość:{" "}
                        {filteredZPsInProductionByClient.length}
                        ):
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Button
                      title="zmień klienta"
                      handlePress={() => {
                        setChosenClient(null);
                      }}
                      height={32}
                      isOutline
                    />
                  </View>
                </View>

                <View className="flex-1 w-full px-6">
                  <FlatList<ZpInProduction>
                    data={filteredZPsInProductionByClient}
                    renderItem={({ item }: { item: ZpInProduction }) => (
                      <ListItemName
                        title={item.ordnmb}
                        id={0}
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
              </>
            ) : null}

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
export default SearchZpByClientModal;
