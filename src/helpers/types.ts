export interface IMetaOptions {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
}


export type OptionType = {
  label: string;
  value: string | number;
  level?: number;
};