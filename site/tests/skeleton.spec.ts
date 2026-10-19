import { expect, test } from '@playwright/test';
import { LOCALES, TITLE_PREFIX, allPages } from './routes';

/**
 * Проверки каркаса сайта (шаг 1.1): FR-01, FR-04, FR-21, FR-24, FR-25, NFR-03, NFR-05, NFR-07.
 */

for (const { locale, url } of allPages()) {
  test(`${url}: страница, язык, баннер, шапка и подвал`, async ({ page }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page).toHaveTitle(new RegExp(`^\\${TITLE_PREFIX[locale]} `));
    await expect(page.locator('[data-test-banner]')).toBeVisible();
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    await expect(page.locator('[data-prototype-note]')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('корень сайта ведёт на русскую версию', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/$/);
});

for (const from of LOCALES) {
  const to = from === 'ru' ? 'en' : 'ru';
  test(`переключатель языка: ${from} → ${to} на той же странице`, async ({ page }) => {
    await page.goto(`/${from}/legal/terms/`);
    await page.locator(`[data-lang-link="${to}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${to}/legal/terms/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', to);
  });
}

test('несуществующий адрес показывает страницу 404 на обоих языках', async ({ page }) => {
  const response = await page.goto('/ru/net-takoy-stranitsy/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('[data-test-banner]')).toBeVisible();
  await expect(page.locator('section[lang="ru"] h1')).toBeVisible();
  await expect(page.locator('section[lang="en"] h1')).toBeVisible();
});

test('страницы не обращаются к внешним адресам (NFR-03)', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const requestUrl = request.url();
    if (!requestUrl.startsWith(baseURL!) && !requestUrl.startsWith('data:')) {
      external.push(requestUrl);
    }
  });
  for (const { url } of allPages()) {
    await page.goto(url, { waitUntil: 'networkidle' });
  }
  expect(external).toEqual([]);
});

test('нет горизонтальной прокрутки на ширине 360 px (NFR-05)', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const { url } of allPages()) {
    await page.goto(url);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, url).toBeLessThanOrEqual(0);
  }
});

test('первое нажатие Tab показывает ссылку «Перейти к содержимому» (NFR-07)', async ({ page }) => {
  await page.goto('/ru/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});
