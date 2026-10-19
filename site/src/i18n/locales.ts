/**
 * Языки сайта (решение владельца D4 от 18.10.2026: русский и английский).
 * Чтобы добавить язык: добавить код сюда, создать словарь `<код>.json`
 * с теми же ключами, что и `ru.json`, и пересобрать сайт.
 */
export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

/** Название языка на самом этом языке, для переключателя. */
export const LOCALE_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}
