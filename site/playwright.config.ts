import { defineConfig, devices } from '@playwright/test';

/**
 * Автоматические сценарии в браузере (ТЗ, раздел 14.1, проверка T5).
 *
 * Перед запуском нужна сборка (`npm run build`); Playwright сам запускает
 * `astro preview` на отдельном порту 4322, чтобы не мешать вашему
 * просмотру на 4321. Сервер слушает только localhost.
 *
 * Первый запуск на новом компьютере: `npx playwright install chromium`
 * (бесплатно скачивает браузер для тестов). Переменная окружения
 * PW_CHROMIUM_EXECUTABLE позволяет указать уже установленный Chromium.
 */
// Минимальное описание process.env, чтобы не добавлять пакет @types/node ради одной строки.
declare const process: { env: Record<string, string | undefined> };

const PORT = 4322;
const executablePath = process.env.PW_CHROMIUM_EXECUTABLE || undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: `node ./node_modules/astro/bin/astro.mjs preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/ru/`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
