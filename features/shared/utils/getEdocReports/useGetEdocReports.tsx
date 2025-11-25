import { useHandleThrowingProperErrorWhenOccuredDuringFetchingData } from "./lib/useHandleThrowingProperErrorWhenOccuredDuringFetchingData";
import { useHandleIsLoadingAndIsFetchingGlobalState } from "./lib/useHandleIsLoadingAndIsFetchingGlobalState";
import { EdocReport } from "./lib/EdocReport";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import useAuthSessionStore from "../../stores/useAuthSessionStore";

import { query_getDataAsServerAction } from "../commonHelpers/queryGetOnServer";
import { ERROR_MESSAGES } from "../messages";
import { useBaseAPI_URL_Store } from "../../stores/useBaseAPI_URL_Store";

// import useAuthSessionStore from "../../stores/authSessionStore";
// import { ERROR_MESSAGES } from "../../constants/utilsUserMessages";
// import { useBaseAPI_URL_Store } from "../../stores/useBaseAPI_URL_Store";

/**
 * token: current token to be used in api requests
 * setIsLoading: function to set isLoading/isFetching global state (e.g. zustand, jotai)
 * reports: array of reports to be fetched/sorted/mapped
 *
 * other requirements:
 * - need to use tanstackQuery - so it needs to be after a tanstackQueryProvider
 */
type AnyKeyValuePair = { [key: string]: string | number | boolean };
type TEdocReportsData = {
  setIsLoading: (boolValue: boolean) => void;
  reports: EdocReport<any, any>[];
  params?: AnyKeyValuePair;
};

export const useGetEdocReports = (edocReportsData: TEdocReportsData) => {
  ////vars
  const { user } = useAuthSessionStore();
  if (!user || !user.tokens.token) {
    throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
  }
  const token = user.tokens.token;

  const { baseURL } = useBaseAPI_URL_Store();
  const setIsLoading = edocReportsData.setIsLoading;
  const reports = edocReportsData.reports;
  const params = edocReportsData.params;

  ////side effects
  const { setIsLoadingOrIsFetching } =
    useHandleIsLoadingAndIsFetchingGlobalState(setIsLoading);
  const { setError, setIsError } =
    useHandleThrowingProperErrorWhenOccuredDuringFetchingData();

  //// refresh data in all reports
  const [refreshAllDataArray, setRefreshAllDataArray] =
    useState<(() => void)[]>();

  function refreshAllData() {
    //TODO: wydaje się, że dodaje zbyt dużo tych funkcji, i je duplikuje ... może zrobić set z tego i sprawdzić
    // console.log("refresh all data in edoc reports");
    if (!refreshAllDataArray) return;
    // console.log("after:  if (!refreshAllDataArray) return;");

    refreshAllDataArray.forEach((refreshFn) => {
      refreshFn();
    });
  }

  //reports data
  const reportsData: any = {};
  for (let report of reports) {
    // console.log({ report });

    ////types
    //DTO
    type TInferFirstGenericArgumentTypeHelper<J extends EdocReport<any, any>> =
      J extends EdocReport<infer N, object> ? N : never;
    type DTOType = TInferFirstGenericArgumentTypeHelper<typeof report>;
    type DTOReportReturnType = {
      data: {
        resultMainQuery: DTOType[] | -1;
      };
    };
    //mappedObjectType
    type TInferSecondGenericArgumentTypeHelper<J extends EdocReport<any, any>> =
      J extends EdocReport<object, infer N> ? N : never;
    type TMappedObjectType = TInferSecondGenericArgumentTypeHelper<
      typeof report
    >;

    //fetch
    // const { data, isLoading, isFetching, isError, refetch, error } =
    //   useFetchDataFromEdok<DTOReportReturnType>(report.fetchingStrategy(), {
    //     queryKey: report.queryKey(),
    //     baseURL: baseURL,
    //     address: report.address(),
    //     token: token,
    //   });

    //params
    let paramsAsProperString = "";
    if (params) {
      paramsAsProperString += "?";
      for (const [key, value] of Object.entries(params)) {
        paramsAsProperString += `${key}=${value}&`;
      }
      paramsAsProperString.slice(0, -1);
    }

    const { data, isLoading, isFetching, isError, refetch, error } =
      useQuery<DTOReportReturnType>({
        queryKey: report.queryKey(),
        queryFn: async (): Promise<DTOReportReturnType> => {
          const dataFetched =
            await query_getDataAsServerAction<DTOReportReturnType>(
              baseURL,
              `${report.address()}${paramsAsProperString}`,
              token
            );
          return dataFetched;
        },
      });

    ////handle adding refresh function to refresh all
    useEffect(() => {
      setRefreshAllDataArray((prev) => (prev ? [...prev, refetch] : [refetch]));
    }, [refetch]);

    //// handle isLoading/isFetching
    useEffect(() => {
      setIsLoadingOrIsFetching(report.dataName(), isLoading, isFetching);
    }, [isLoading, isFetching]);

    //// handle isError and throw Error when occured
    useEffect(() => {
      setIsError(report.dataName(), isError);
      setError(report.dataName(), error);
    }, [isError, error]);

    //// data
    const queriedData: DTOType[] = useMemo(() => {
      if (!data?.data?.resultMainQuery || data?.data?.resultMainQuery === -1)
        return [];
      return data.data.resultMainQuery as DTOType[];
    }, [data]);

    // console.log({ queriedData });

    const sortedData: DTOType[] = report.sort(queriedData);
    const mappedData: TMappedObjectType = report.map(sortedData);
    reportsData[report.dataName()] = mappedData as TMappedObjectType;
  }

  return { ...reportsData, refreshAllData };
};
