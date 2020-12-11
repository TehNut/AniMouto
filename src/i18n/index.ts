import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./LanguageEnglish";

Vue.use(VueI18n);

const i18n = new VueI18n({
  fallbackLocale: "en",
  messages: {
    en
  }
});

export default i18n;