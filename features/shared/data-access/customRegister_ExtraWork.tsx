import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Post_ExtraWork_ZP_DTO } from "../types/interfaces-extra_works";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

export const customRegister_ExtraWork = new EdocCustomRegister<
  Post_ExtraWork_ZP_DTO,
  Post_ExtraWork_ZP_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_ExtraWork}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.EXTRA_WORKS],
});
