import { i18n } from "@lingui/core";
import { messages } from "~/locales/en/messages";

export const LANGUAGES = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "bg",
    label: "Български",
  },
] as const;

const DEFAULT_LOCALE = "en";

export const changeLanguage = async (
  locale: (typeof LANGUAGES)[number]["value"]
) => {
  const { messages } = await import(`../locales/${locale}/messages.po`);
  i18n.loadAndActivate({ locale, messages });
  localStorage.setItem("locale", locale);
};

i18n.loadAndActivate({
  locale: DEFAULT_LOCALE,
  messages,
});

if (localStorage.getItem("locale")) {
  changeLanguage(
    localStorage.getItem("locale") as (typeof LANGUAGES)[number]["value"]
  );
}

export { i18n };
