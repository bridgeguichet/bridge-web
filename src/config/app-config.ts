import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Bridge",
  version: packageJson.version,
  copyright: `© ${currentYear}, Bridge guichet`,
  meta: {
    title: "Bridge - Votre Guichet d'Accompagnement Global",
    description:
      "Bridge est le premier guichet d'accompagnement global pour la diaspora, expatriés, investisseurs et retraités. Installation, services premium, et accompagnement personnalisé en RDC.",
  },
};
