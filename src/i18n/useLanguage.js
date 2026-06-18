import { useTranslation } from "react-i18next";

export const LANGUAGE_STORAGE_KEY = "gamehub-accessibility";

export const getSavedLanguage = () => {
  try {
    const preferences = JSON.parse(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    return preferences?.language ?? "es";
  } catch {
    return "es";
  }
};

export function useLanguage() {
  const { i18n } = useTranslation();
  return i18n.language || getSavedLanguage();
}
