export type Locale = "en" | "ja" | "cy" | "fr" | "pt-BR" | "de" | "it" | "my" | "es";
import en from "../../../public/locales/en.json";
import ja from "../../../public/locales/ja.json";
import cy from "../../../public/locales/cy.json";
import fr from "../../../public/locales/fr.json";
import pt_BR from "../../../public/locales/pt-BR.json";
import de from "../../../public/locales/de.json";
import it from "../../../public/locales/it.json";
import my from "../../../public/locales/my.json";
import es from "../../../public/locales/es.json";

export type Translations = {
  readonly [key: string]: string | { readonly [key: string]: string | object };
} & typeof en;

export const locales: Locale[] = ["en", "ja", "cy", "fr", "pt-BR", "de", "it", "my", "es"];
export const defaultLocale: Locale = "en";

const translations: Record<Locale, Translations> = {
  en,
  ja,
  cy,
  fr,
  "pt-BR": pt_BR,
  de,
  it,
  my,
  es
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}

type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & (string | number)];