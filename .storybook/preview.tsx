import '../app/globals.css';
import type { Preview } from '@storybook/nextjs';
import { isSupportedLocale } from '@/shared/i18n/config';
import { I18nProvider } from '@/shared/i18n/client';
import { enMessages } from '@/shared/i18n/messages/en';
import { koMessages } from '@/shared/i18n/messages/ko';
import { viMessages } from '@/shared/i18n/messages/vi';
import type { AppLocale } from '@/shared/i18n/types';

const storybookMessages: Record<AppLocale, typeof enMessages> = {
  en: enMessages,
  ko: koMessages,
  vi: viMessages,
};

const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Global locale for i18n',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'ko', title: 'Korean' },
          { value: 'vi', title: 'Vietnamese' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      const selectedLocale = globals.locale;
      const locale = isSupportedLocale(selectedLocale) ? selectedLocale : 'en';

      return (
        <I18nProvider locale={locale} messages={storybookMessages[locale]}>
          <Story />
        </I18nProvider>
      );
    },
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
