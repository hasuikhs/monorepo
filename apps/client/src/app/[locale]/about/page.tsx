
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

export default function About() {
  const t = useTranslations('About');

  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/">{t('home')}</Link>
    </div>
  );
}
