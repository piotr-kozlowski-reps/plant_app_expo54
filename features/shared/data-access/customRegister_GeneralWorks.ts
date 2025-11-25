import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Post_GeneralWork_DTO } from "../types/interfaces-general_works";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

export const customRegister_GeneralWorks = new EdocCustomRegister<
  Post_GeneralWork_DTO,
  Post_GeneralWork_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_GeneralWorks}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.GENERAL_WORKS],
});
