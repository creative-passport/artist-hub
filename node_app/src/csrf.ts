import csrf from 'csurf';

/**
 * Express middleware providing CSRF protection
 */
export const csrfProtection = csrf({ cookie: true });
