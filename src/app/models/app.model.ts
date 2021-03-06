export interface ICalculatorPercentageSettings {
  saving: number;
  gst: number;
}

export enum LanguageTypes {
  'ENGLISH' = 'en',
  'HINDI' = 'hi',
}

export interface ICalculatorFormValues {
  buy_price: number;
  transport: number;
  insurance: number;
}

export enum StorageKeyTypes {
  GS_CALCULATOR_PERCENTAGE_SETTING = 'GS_CALCULATOR_PERCENTAGE_SETTING',
  GS_CALCULATOR_DEFAULT_LANGUAGE = 'GS_CALCULATOR_DEFAULT_LANGUAGE',
}
