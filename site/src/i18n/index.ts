import ru from './ru.json';
import en from './en.json';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './locales.ts';

export { DEFAULT_LOCALE, LOCALES, LOCALE_NAMES, isLocale, type Locale } from './locales.ts';

/** Структура словаря задаётся русским словарём; остальные обязаны ей соответствовать. */
export type Dictionary = typeof ru;

// Проверка типов: английский словарь должен иметь те же ключи, что и русский.
const dictionaries: Record<Locale, Dictionary> = { ru, en };

/** Тексты интерфейса для языка. */
export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Подставляет значения в шаблон вида «Шаг {step}». */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Адрес страницы для языка. `path` — путь без языка, например `catalog/` или `legal/terms/`.
 * Всегда возвращает адрес с завершающим слешем (настройка trailingSlash: 'always').
 */
export function localizedPath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const withSlash = clean === '' || clean.endsWith('/') || clean.includes('#') ? clean : `${clean}/`;
  return `/${locale}/${withSlash}`;
}

/** Язык из адреса страницы; если адрес без языка — язык по умолчанию. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Тот же адрес на другом языке: `/ru/catalog/` → `/en/catalog/`. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    parts.shift();
  }
  return localizedPath(target, parts.join('/'));
}

/** Параметры для getStaticPaths страниц внутри `src/pages/[lang]/`. */
export function localeStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}
