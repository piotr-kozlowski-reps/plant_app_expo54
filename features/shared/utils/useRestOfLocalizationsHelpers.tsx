import { useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587 } from "../data-access/useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import { RestOfLocalizationsDespiteOfOneChosen } from "../types/interfaces-localization";
import { useCheckWhatValueIsScannedHelpers } from "./useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "./useErrorHandler";

export const useRestOfLocalizationsHelpers = () => {
  ////vars
  const { getPureFieldValue } = useCheckWhatValueIsScannedHelpers();
  const { getAllZPsInLocalizationWithAllLocalizationsInfo_Report1587 } =
    useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  async function addRestOfLocalizationsWhenScannedFieldHandler(
    scannedValue: string,
    setRestOfLocalizations: (
      value: React.SetStateAction<RestOfLocalizationsDespiteOfOneChosen[]>
    ) => void
  ) {
    const planam = getPureFieldValue(scannedValue);

    //fetch all desired info
    const ZPsPerLocalizationWithInfoAboutAllLocalizations =
      await getAllZPsInLocalizationWithAllLocalizationsInfo_Report1587(
        token!,
        planam,
        errorHandler
      );

    const ZPsWIthMoreThanOneLocalization =
      ZPsPerLocalizationWithInfoAboutAllLocalizations?.filter(
        (zp) => zp.localization.length > 1
      );

    if (ZPsWIthMoreThanOneLocalization?.length) {
      const ZPsWithRestOfLocalizations = ZPsWIthMoreThanOneLocalization.map(
        (item) => {
          const ordnmb = item.ordnmb;
          const restOfLocalizations = item.localization.filter(
            (loc) => loc.planam !== planam
          );
          return {
            ordnmb,
            restOfLocalizations: restOfLocalizations.map(
              (locInn) => locInn.planam
            ),
          };
        }
      );

      setRestOfLocalizations(ZPsWithRestOfLocalizations);
    }
  }

  return { addRestOfLocalizationsWhenScannedFieldHandler };
};
