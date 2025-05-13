
'use client';

import { useTranslations } from 'next-intl';

export default function Button() {
  const t = useTranslations('Button');

  return <button onClick={ () => console.log(t('confirm')) }>{t('confirm')}</button>;
}
