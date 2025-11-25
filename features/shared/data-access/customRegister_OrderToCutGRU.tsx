import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Post_OrderToCutGRU_DTO } from "../types/interfaces-cut";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

export const customRegister_OrderToCutGRU = new EdocCustomRegister<
  Post_OrderToCutGRU_DTO,
  Post_OrderToCutGRU_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_CutGRU}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.CUTS_LIST],
});
