import { ZPLocalizationInfoPlusQuantityToBeMoved } from "./interfaces-zp";

export type Localization = {
  id____: number;
  planam: string;
};

export type LocalizationDTO = {
  id____: string;
  planam: string;
};

export type LocalizationResponse = {
  data: {
    resultMainQuery: LocalizationDTO[] | -1;
  };
};

export type QuantityPerLocalizationInput = {
  qntity: number;
};

export type LocalizationInfoPerScannedField = {
  id____: number;
  ile: number;
  ordout: number;
  planam: string;
};

// export type RestOfLocalizations = {
//   ordnmb: string;
//   restOfLocalizations: LocalizationInfoPerScannedField[]
// };
export type RestOfLocalizationsDespiteOfOneChosen = {
  ordnmb: string;
  restOfLocalizations: string[];
};
