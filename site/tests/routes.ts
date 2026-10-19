/**
 * Все страницы, которые должны существовать на каждом языке (ТЗ, раздел 9).
 * При добавлении новой статической страницы добавьте её путь сюда,
 * и автоматические проверки сразу начнут её проверять.
 */
export const LOCALES = ['ru', 'en'] as const;

export const STATIC_PATHS = [
  '',
  'catalog/',
  'search/',
  'license/',
  'quality/',
  'about/',
  'legal/terms/',
  'legal/privacy/',
  'legal/takedown/',
] as const;

export const TITLE_PREFIX = { ru: '[ТЕСТ]', en: '[TEST]' } as const;

export function allPages() {
  return LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({ locale, url: `/${locale}/${path}` })),
  );
}
