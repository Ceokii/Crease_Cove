// @ts-check
import { defineConfig } from 'astro/config';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales.ts';

// Настройки локального прототипа Crease Cove.
// Важно: сервер слушает только localhost (ТЗ, SEC-02). Не добавлять `host`.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  server: {
    port: 4321,
    host: false,
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // Корень сайта ведёт на версию языка по умолчанию (ТЗ, раздел 9).
  redirects: {
    '/': `/${DEFAULT_LOCALE}/`,
  },
  // Никакой телеметрии и внешних запросов при сборке и просмотре (ТЗ, SEC-03).
  devToolbar: {
    enabled: false,
  },
});
