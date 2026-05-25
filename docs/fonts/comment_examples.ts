////
////procedura
////

/**
 * @public
 * @topic
 * PROCEDURA:
 */
/**
 * @public
 * @procedureDescription
 * Wyświetlany jest aktualnie pikowany Zpek.
 * Należy wybrać kolor z dostępnych kolorów dla ZP.
 * Skanowanie tac i podpinanie ich do wybranego koloru.
 * Na końcu podanie wypikowanej ilości i wysyłka.
 */

////
////mutations
////
/**
 * @public
 * @transformApiItem
 * wysyłka - custom api:
 * <b>{{URL}}</b>/api.php/REST/custom/<b>risecount</b>
 * dane - array obiektów:
 * {
 *  sordid: number
 *  ordnmb: string
 *  stk_id: string
 *  lckcnt: number
 *  scanned_raw_value: string
 * }
 * @separator
 */

////
////separator
////
// * @separator

////
////raport from external file
////
/**
 * @public
 * @procedureItem
 * raporty:
 * @readFile `features/shared/data-access/edocReport_ProtectiveTreatments.ts`
 */

////
////guard
////
/**
 * @public
 * @guard
 * Jeżeli taca była już wcześniej zeskanowana - info + koniec procedury.
 */
