const envConfigMap = {
  baseUrl: 'BASE_URL',
  cookieSecret: 'COOKIE_SECRET',
  oidcDiscoveryUrl: 'OIDC_DISCOVERY_URL',
  oidcClientId: 'OIDC_CLIENT_ID',
  oidcSecret: 'OIDC_SECRET',
};

type Config = {
  [Property in keyof typeof envConfigMap]: string;
};

const config: Config = (() => {
  let c: { [key: string]: string } = {};
  for (const [key, env] of Object.entries(envConfigMap)) {
    const val = process.env[env];
    if (!val) {
      throw new Error(`Environment variable ${env} must be defined.`);
    }
    c[key] = val;
  }
  return c as Config;
})();

export default config;
