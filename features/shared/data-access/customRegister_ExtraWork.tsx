import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Post_ExtraWork_ZP_DTO } from "../types/interfaces-extra_works";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

/**
 * @public
 * @transformApiItem
 * wysyłka - Prace Extra:
 * adres: <b>{{URL}}</b>/api.php/REST/v1/customRegisters/<b>238</b>/entries
 * @separator
 * <b>dane</b>:
 * [
 *     {
 *          activityid: number;
 *          begindat: Date;
 *          donedat: Date;
 *          mobile: boolean;
 *          qntity: number;
 *     }
 * ]
 */
export const customRegister_ExtraWork = new EdocCustomRegister<
  Post_ExtraWork_ZP_DTO,
  Post_ExtraWork_ZP_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_ExtraWork}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.EXTRA_WORKS],
});
