import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {

  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: [ '/((?!api|_next|.*\\..*).*)' ]
};
