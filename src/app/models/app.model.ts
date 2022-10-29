export interface ICalculatorPercentageSettings {
  saving: number;
  gst: number;
  currency: string;
  currencySymbol: string;
}

export enum LanguageTypes {
  "ENGLISH" = "en",
  "HINDI" = "hi",
}

export interface ILabelColor {
  label: string;
  color: string;
}

export interface ICalculatorFormValues {
  buy_price: number;
  transport: number;
  insurance: number;
}

export interface ICurrencyList {
  name: string;
  sign: string;
  code: string;
}

export enum StorageKeyTypes {
  GS_CALCULATOR_PERCENTAGE_SETTING = "GS_CALCULATOR_PERCENTAGE_SETTING",
  GS_CALCULATOR_DEFAULT_LANGUAGE = "GS_CALCULATOR_DEFAULT_LANGUAGE",
}
