import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'es', 'pt'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale)) {
    locale = 'pt';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
