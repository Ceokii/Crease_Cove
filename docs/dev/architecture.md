# Устройство сайта (техническая заметка)

Заметка для того, кто будет менять код: владельца, исполнителя или другого разработчика. Описывает, как устроен прототип **сейчас**. Обновляется вместе с кодом на каждом шаге этапа 1.

Основание: ТЗ, разделы 5, 6 и 9 ([`../Crease_Cove_Technical_Specification.md`](../Crease_Cove_Technical_Specification.md)).

## 1. Общая схема

Статический сайт на Astro. При сборке (`npm run build`) все страницы превращаются в готовые HTML-файлы в `site/dist/`. При просмотре (`npm run preview`) локальный сервер Astro только отдаёт эти файлы браузеру на `http://localhost:4321`. Серверной логики, базы данных и внешних запросов нет.

## 2. Папки `site/`

| Путь | Что там | Когда менять |
|---|---|---|
| `astro.config.mjs` | Настройки Astro: статическая сборка, порт 4321, только localhost, языки, перенаправление `/` → `/ru/` | Редко; `host` не добавлять |
| `src/pages/[lang]/` | Страницы сайта. `[lang]` — подставляется `ru` и `en` | Добавление страницы |
| `src/pages/404.astro` | Страница «не найдено», одна на оба языка | Редко |
| `src/layouts/BaseLayout.astro` | Общий каркас каждой страницы: `<head>`, баннер, шапка, `<main>`, подвал | Изменения, общие для всех страниц |
| `src/components/` | Повторяющиеся части: `Header`, `Footer`, `TestBanner`, `LanguageSwitcher`, `Placeholder`, `DraftNotice` | Изменение конкретной части |
| `src/i18n/` | Языки (`locales.ts`), словари (`ru.json`, `en.json`), функции работы с языком (`index.ts`) | Любой текст интерфейса |
| `src/styles/tokens.css` | **Все** цвета, шрифты, размеры, отступы | Дизайн сайта |
| `src/styles/global.css` | Базовые стили, использующие токены | Редко |
| `public/` | Файлы, копируемые без изменений (`favicon.svg`; позже — тестовые ассеты) | Статические файлы |
| `tests/` | Автоматические сценарии Playwright; `routes.ts` — список всех страниц | При добавлении страниц и функций |
| `playwright.config.ts` | Настройки автотестов: отдельный порт 4322 | Редко |

## 3. Языки

- Языки перечислены в `src/i18n/locales.ts`: `ru` (по умолчанию) и `en`.
- Адреса всегда с языком: `/ru/catalog/`, `/en/catalog/`. Корень `/` перенаправляет на `/ru/`.
- Все тексты интерфейса — в `src/i18n/ru.json` и `src/i18n/en.json`. В шаблонах текст не пишется напрямую, только через словарь:

  ```astro
  const t = useTranslations(locale);
  <h1>{t.pages.catalog.heading}</h1>
  ```

- Структуру словаря задаёт `ru.json`. Если в `en.json` не хватает ключа, `npm run check` выдаст ошибку типов. Так перевод не может «потеряться».
- Ссылки строятся только функцией `localizedPath(locale, 'catalog/')`, а не вручную. Она добавляет язык и завершающий слеш.
- Переключатель языка (`LanguageSwitcher`) берёт текущий адрес и меняет в нём только язык: `/ru/legal/terms/` → `/en/legal/terms/`.

## 4. Как добавить страницу

1. Создать файл `src/pages/[lang]/<имя>.astro` по образцу `catalog.astro`:

   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro';
   import { localeStaticPaths, useTranslations, type Locale } from '../../i18n';

   export const getStaticPaths = localeStaticPaths;

   const locale = Astro.params.lang as Locale;
   const page = useTranslations(locale).pages.<имя>;
   ---

   <BaseLayout locale={locale} title={page.title}>
     <h1>{page.heading}</h1>
   </BaseLayout>
   ```

2. Добавить тексты `pages.<имя>` в `ru.json` и `en.json`.
3. Добавить путь в `tests/routes.ts` — автотесты начнут проверять страницу на обоих языках.
4. При необходимости добавить ссылку в `Header.astro` или `Footer.astro`.
5. Выполнить `npm run check-all`.

## 5. Дизайн

Оформление каркаса нейтральное и временное: дизайн сайта определяет владелец. Правила, чтобы смена дизайна была простой:

- Цвета, шрифты, размеры и отступы задаются только переменными из `src/styles/tokens.css`. В компонентах нет «жёстких» значений цветов и размеров.
- Стили компонента лежат внутри самого компонента (блок `<style>`), Astro изолирует их от других компонентов.
- Шрифты только системные или локальные файлы в проекте. Загрузка шрифтов из интернета запрещена (SEC-03).
- Баннер тестовых данных должен оставаться заметным при любом дизайне (FR-04).

## 6. Особые требования, заложенные в каркас

| Требование ТЗ | Где реализовано |
|---|---|
| FR-04 баннер на каждой странице | `TestBanner.astro` в `BaseLayout.astro` |
| Пометка «[ТЕСТ]» / «[TEST]» во вкладке | `BaseLayout.astro`, ключ `site.testTitlePrefix` |
| FR-21 страница 404 | `src/pages/404.astro` |
| FR-24 две языковые версии | `src/pages/[lang]/`, `astro.config.mjs` (`i18n`) |
| FR-25 переключатель языка | `LanguageSwitcher.astro` |
| NFR-02 только localhost | `astro.config.mjs` (`server.host: false`) |
| NFR-03 нет внешних запросов | системные шрифты; автотест в `tests/skeleton.spec.ts` |
| NFR-05 ширина от 360 px | токены `--text-xl`, `--text-2xl` с `clamp()`; автотест |
| NFR-07 доступность | ссылка «Перейти к содержимому», `:focus-visible`, `aria-label` у навигации, `lang` у документа |
| Сайт не индексируется | `<meta name="robots" content="noindex, nofollow">` |
| Нет телеметрии Astro | `postinstall` в `package.json` выполняет `astro telemetry disable`; панель разработчика отключена |

## 7. Особенности среды исполнителя

Исполнитель (Claude Code) работает в облачной среде, которую Astro 7 распознаёт как ИИ-агента. В этом режиме `astro dev` и `astro preview` по умолчанию уходят в фоновый режим. Поэтому в `playwright.config.ts` сервер запускается с флагом `--ignore-lock`, который оставляет его на переднем плане и позволяет Playwright корректно его остановить. На компьютере владельца флаг ни на что не влияет.
