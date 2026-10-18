# Ресурсы проекта

Полный список программ, библиотек, стандартов и сервисов, которые используются или будут использованы для сайта. Все ресурсы бесплатны. Обновляется при каждом изменении зависимостей.

Источник истины для точных версий — `site/package-lock.json`. Список и правила — ТЗ, раздел 4.

## 1. Библиотеки сайта

| Пакет | Версия | Лицензия | Назначение | Статус | Документация |
|---|---|---|---|---|---|
| `astro` | 7.4.0 | MIT | Сборка сайта, шаблоны, локальный сервер, два языка, проверка данных (Zod) | Установлен, шаг 1.1 | [docs.astro.build](https://docs.astro.build/) |
| `typescript` | 6.0.3 | Apache-2.0 | Проверка типов. Версия 6, потому что `@astrojs/check` пока не поддерживает 7 | Установлен, шаг 1.1 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| `@astrojs/check` | 0.9.10 | MIT | Команда `astro check` | Установлен, шаг 1.1 | [astro check](https://docs.astro.build/en/reference/cli-reference/#astro-check) |
| `@playwright/test` | 1.64.1 | Apache-2.0 | Автоматические сценарии в браузере | Установлен, шаг 1.1 | [playwright.dev](https://playwright.dev/docs/intro) |
| `linkinator` | 8.1.0 | MIT | Проверка ссылок в собранном сайте | Установлен, шаг 1.1 | [github.com/JustinBeckwith/linkinator](https://github.com/JustinBeckwith/linkinator) |
| `@gltf-transform/core`, `@gltf-transform/extensions` | 4.5.1 | MIT | Генерация тестовых GLB с вариантами материалов | Шаг 1.3 | [gltf-transform.dev](https://gltf-transform.dev/) |
| `fflate` | 0.8.3 | MIT | Создание тестовых ZIP-пакетов | Шаг 1.3 | [github.com/101arrowz/fflate](https://github.com/101arrowz/fflate) |
| `@google/model-viewer` | 4.4.0 | Apache-2.0 | 3D-превью и переключение вариантов | Шаг 1.5 | [modelviewer.dev](https://modelviewer.dev/) |
| `three` | 0.183.x | MIT | 3D-движок для model-viewer (версия задана требованием model-viewer) | Шаг 1.5 | [threejs.org](https://threejs.org/) |
| `pagefind` | 1.5.2 | MIT | Поиск и фильтры без сервера, отдельный индекс для каждого языка | Шаг 1.6 | [pagefind.app](https://pagefind.app/) |

Версии указаны на 18.10.2026. При установке на своём шаге исполнитель проверяет актуальную версию в пределах той же основной версии и обновляет эту таблицу.

## 2. Программы

| Программа | Версия | Где | Назначение | Ссылка |
|---|---|---|---|---|
| Node.js | 24 LTS (24.22.0 у исполнителя) | Компьютер владельца, среда исполнителя | Запуск сборки, сервера и скриптов | [nodejs.org](https://nodejs.org/en/download) |
| npm | Идёт с Node.js | Там же | Установка библиотек, запуск команд | [docs.npmjs.com](https://docs.npmjs.com/) |
| Git | Актуальная | Там же | Получение кода, ветки | [git-scm.com](https://git-scm.com/downloads/win) |
| Браузер | Актуальный Chrome, Edge или Firefox | Компьютер владельца | Просмотр прототипа | — |
| Chromium для тестов | Скачивается командой `npx playwright install chromium` | По желанию | Автотесты | [playwright.dev](https://playwright.dev/docs/browsers) |
| Visual Studio Code | Необязательно | Компьютер владельца | Просмотр и правка файлов | [code.visualstudio.com](https://code.visualstudio.com/) |

## 3. Стандарты

| Стандарт | Где используется | Ссылка |
|---|---|---|
| HTML, CSS | Все страницы | [MDN](https://developer.mozilla.org/en-US/docs/Web) |
| glTF 2.0 / GLB, `KHR_materials_variants` | Тестовые 3D-модели (шаг 1.3) | [khronos.org/gltf](https://www.khronos.org/gltf/) |
| WCAG 2.2 | Доступность | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |

## 4. Сервисы

| Сервис | Тариф | Назначение |
|---|---|---|
| GitHub, репозиторий `Ceokii/Crease_Cove` | Бесплатный | Код, документы, ветки, PR |
| Реестр npm | Бесплатный, без аккаунта | Скачивание библиотек |

GitHub Actions, облачные хостинги и хранилища не используются (ТЗ, раздел 4.4).

## 5. Как добавить или обновить библиотеку

1. Получить согласие владельца, если библиотеки нет в таблице раздела 1 (ТЗ, раздел 4.7).
2. Установить с точной версией: `npm install --save-exact <пакет>@<версия>` (для инструментов разработки — с `--save-dev`).
3. Проверить лицензию (`npm view <пакет> license`) и уязвимости (`npm audit`).
4. Обновить таблицу раздела 1 и журнал решений [`decisions.md`](decisions.md).
5. Выполнить `npm run check-all`.
