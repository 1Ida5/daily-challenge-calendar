export async function loadLanguage() {
  const en = await fetch("/localization/en.json").then((r) => r.json());
  const no = await fetch("/localization/no.json").then((r) => r.json());

  const browserLang = navigator.languages?.[0] || navigator.language || "en";

  const lang =
    browserLang.startsWith("no") ||
    browserLang.startsWith("nb") ||
    browserLang.startsWith("nn")
      ? "no"
      : "en";

  const t = lang === "no" ? no : en;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  return { lang, t };
}
