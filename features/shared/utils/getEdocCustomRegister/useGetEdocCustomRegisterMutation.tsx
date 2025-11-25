import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EdocCustomRegister } from "./lib/EdocCustomRegister";
import useAuthSessionStore from "../../stores/useAuthSessionStore";

import { ERROR_MESSAGES } from "../messages";
import { useBaseAPI_URL_Store } from "../../stores/useBaseAPI_URL_Store";
import { query_postDataAsServerAction } from "../commonHelpers/queryPostOnServer";
import { useChooseWhichErrorToHandle } from "../useChooseWhichErrorToHandle";
import { query_deleteDataAsServerAction } from "../commonHelpers/queryDeleteOnServer";

type TEdocCustomRegisterData = {
  customRegister: EdocCustomRegister<any, any>;
};

export function useGetEdocCustomRegisterMutation(
  edocCustomRegisterData: TEdocCustomRegisterData
) {
  ////vars
  const { user } = useAuthSessionStore();
  const { chooseWhichErrorToHandle } = useChooseWhichErrorToHandle();

  if (!user || !user.tokens.token) {
    throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
  }
  const token = user.tokens.token;

  const { baseURL } = useBaseAPI_URL_Store();

  // const baseURL = edocCustomRegisterData.baseURL;
  const address = edocCustomRegisterData.customRegister.address();
  const queryKeysToBeRevalidated =
    edocCustomRegisterData.customRegister.queryKeysToBeRevalidated();
  const customRegister = edocCustomRegisterData.customRegister;
  const queryClient = useQueryClient();
  // const { setIsCustomLoading } = useCustomLoadingStore();

  ////types
  type TInferFirstGenericArgumentFromEdocCustomRegister<
    J extends EdocCustomRegister<any, any>
  > = J extends EdocCustomRegister<infer N, unknown> ? N : never;
  type TInferSecondGenericArgumentFromEdocCustomRegister<
    J extends EdocCustomRegister<any, any>
  > = J extends EdocCustomRegister<unknown, infer N> ? N : never;

  type TResponseFromCustomRegister = {
    data: { id____: number };
  };
  type TPost = TInferSecondGenericArgumentFromEdocCustomRegister<
    typeof customRegister
  >;
  type TBase = TInferFirstGenericArgumentFromEdocCustomRegister<
    typeof customRegister
  >;
  type TPatch = Partial<TBase> & {
    idOfPatchedItem: string | number;
  };
  type TResponseFromCustomRegisterWhenDelete = null;
  type TDelete = {
    id: string | number;
  };

  ////c(r)ud functions
  //POST
  const {
    mutate: POSTmutation,
    mutateAsync: POSTasyncMutation,
    isPending: isPending_POSTdata,
    isError: isError_POSTdata,
    error: error_POSTdata,
  } = useMutation<TResponseFromCustomRegister, Error, TPost>({
    mutationFn: async (dataToPost) => {
      const postDataResponse = await query_postDataAsServerAction<
        TResponseFromCustomRegister,
        TPost
      >(baseURL, address, token, dataToPost);
      return postDataResponse;
    },
    onSuccess: () => {
      invalidateAllProvidedQueries();
    },
  });

  //PATCH
  const {
    mutate: PATCHmutation,
    mutateAsync: PATCHasyncMutation,
    isPending: isPending_PATCHdata,
    isError: isError_PATCHdata,
    error: error_PATCHdata,
  } = useMutation<TResponseFromCustomRegister, Error, TPatch>({
    mutationFn: async (patchObjData) => {
      const patchDataResponse = await query_postDataAsServerAction<
        TResponseFromCustomRegister,
        TPost
      >(baseURL, address, token, patchObjData);
      return patchDataResponse;
    },
    onSuccess: () => {
      invalidateAllProvidedQueries();
    },
  });

  //DELETE
  const {
    mutate: DELETEmutation,
    mutateAsync: DELETEasyncMutation,
    isPending: isPending_DELETEdata,
    isError: isError_DELETEdata,
    error: error_DELETEdata,
  } = useMutation<TResponseFromCustomRegisterWhenDelete, Error, TDelete>({
    mutationFn: async ({ id }) => {
      await query_deleteDataAsServerAction<TResponseFromCustomRegisterWhenDelete>(
        baseURL,
        address,
        token,
        id
      );
      return null;
    },
    onSuccess: () => {
      invalidateAllProvidedQueries();
    },
  });

  ////helpers
  function invalidateAllProvidedQueries() {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.every((key) =>
          queryKeysToBeRevalidated.includes(key as string)
        ),
    });
  }

  ////side effects
  //errors
  const isError = isError_POSTdata || isError_PATCHdata;
  if (isError) {
    const errors = [error_POSTdata, error_PATCHdata, error_DELETEdata];
    for (let err of errors) {
      if (err && err.message) {
        chooseWhichErrorToHandle(err);
      }
    }
  }

  //is loading/fetching
  const isLoading =
    isPending_POSTdata ||
    isPending_PATCHdata ||
    isPending_DELETEdata ||
    isError_DELETEdata;
  // useEffect(() => {
  //   if (isLoading) setIsCustomLoading(true);
  //   else setIsCustomLoading(false);
  // }, [isLoading]);

  ////final return
  return {
    POSTmutation,
    POSTasyncMutation,
    PATCHmutation,
    PATCHasyncMutation,
    DELETEmutation,
    DELETEasyncMutation,
  };
}
