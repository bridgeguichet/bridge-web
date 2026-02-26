# i18next Integration Guide

This project uses i18next for internationalization with support for French (default) and English.

## Installation

First, install the required dependencies:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
# or
pnpm add i18next react-i18next i18next-browser-languagedetector
# or
yarn add i18next react-i18next i18next-browser-languagedetector
```

## Usage

### In Components

Use the `useTranslation` hook to access translations:

```tsx
"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <p>{t("auth.email")}</p>
    </div>
  );
}
```

### Language Switcher

Add the `LanguageSwitcher` component to your navbar or header:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Translation Files

Translation files are located in:

- French: `src/lib/i18n/locales/fr/translation.json`
- English: `src/lib/i18n/locales/en/translation.json`

### Adding New Translations

Add your translation keys to both files:

```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "My feature description"
  }
}
```

Then use them in your components:

```tsx
const { t } = useTranslation();
<h1>{t("myFeature.title")}</h1>;
```

### Interpolation

You can use variables in translations:

```json
{
  "greeting": "Hello, {{name}}!"
}
```

```tsx
t("greeting", { name: "John" });
```

## Configuration

The i18n configuration is in `src/lib/i18n/config.ts`:

- Default language: French (`fr`)
- Fallback language: French (`fr`)
- Language detection: localStorage → browser navigator
- Language preference is saved in localStorage

## Features

- ✅ Client-side language switching
- ✅ Persistent language preference (localStorage)
- ✅ Browser language detection
- ✅ TypeScript support
- ✅ French and English translations
