import { defineMiddleware } from "astro:middleware";
let prevPath = '/';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const PROTECTED_PREFIX = "/mi-cuenta";

  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const isLoggedIn = context.cookies.has('identity');

    if (isLoggedIn) {
      return next();
    } else {
      return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  } else {
    if (pathname !== '/undefined') {
      prevPath = pathname;
    }
    return next();
  }
});