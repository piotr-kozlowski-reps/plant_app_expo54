import { toast } from "sonner-native";
import { useBaseAPI_URL_Store } from "../stores/useBaseAPI_URL_Store";
import { DocId, DocIdRequestDTO } from "../types/interfaces-general";
import { query_postDataAsServerAction } from "../utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES } from "../utils/messages";

export const useCreateDocId = () => {
  const { baseURL } = useBaseAPI_URL_Store();

  async function createDocId(
    token: string,
    dataToBeSent: DocIdRequestDTO,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<DocId | null> {
    let response: DocId;
    try {
      response = await query_postDataAsServerAction<DocId, DocIdRequestDTO>(
        baseURL,
        "/api.php/REST/v1/documents",
        token,
        dataToBeSent
      );

      if (!response.doc_id || response.doc_id === "-1") {
        toast.error(ERROR_MESSAGES.PROBLEM_WITH_CREATING_DOCID);
        return null;
      }

      return response;
    } catch (error) {
      console.error(error);
      errorHandler(error as Error);
    }

    return null;
  }

  return { createDocId };
};
