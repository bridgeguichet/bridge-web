import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const result = useI18nTranslation();
  return {
    ...result,
    language: result.i18n.language,
  };
};
