import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import Button from '../components/Button';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/">{t('home')}</Link>
      <Link href="/about">{t('about')}</Link>
      <Button />
    </div>
  );
}
