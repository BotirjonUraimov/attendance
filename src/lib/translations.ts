// Simple translation system without next-intl complexity

import enMessages from "../../messages/en.json";
import uzMessages from "../../messages/uz.json";

const messages = { en: enMessages, uz: uzMessages };

export function getTranslations(locale: string = "uz") {
  const validLocale = locale === "en" ? "en" : "uz";
  const currentMessages = messages[validLocale];

  return function t(key: string): string {
    const keys = key.split(".");
    let value: any = currentMessages;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };
}

export { messages };
