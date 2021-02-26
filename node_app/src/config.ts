type EnvDescriptor = string | { env: string; optional?: boolean };
type EnvMap = { [key: string]: EnvDescriptor };

const envConfigMap: EnvMap = {
  baseUrl: 'BASE_URL',
  cookieSecret: 'COOKIE_SECRET',
  authMode: 'AUTH_MODE',
};

const localOptions: EnvMap = {
  localUsername: 'LOCAL_USERNAME',
  localPasswordHash: 'LOCAL_PASSWORD_HASH',
};

const oidcOptions: EnvMap = {
  oidcDiscoveryUrl: 'OIDC_DISCOVERY_URL',
  oidcClientId: 'OIDC_CLIENT_ID',
  oidcSecret: 'OIDC_SECRET',
  oicdProviderName: 'OIDC_PROVIDER_NAME',
  oidcHelpText: { env: 'OIDC_HELP_TEXT', optional: true },
};

type Config = {
  baseUrl: string;
  cookieSecret: string;
} & (
  | {
      authMode: 'oidc';
      oidcDiscoveryUrl: string;
      oidcClientId: string;
      oidcSecret: string;
      oicdProviderName: string;
      oidcHelpText?: string;
    }
  | {
      authMode: 'local';
      localUsername: string;
      localPasswordHash: string;
    }
);

const config: Config = (() => {
  let configMap = envConfigMap;
  switch (process.env.AUTH_MODE) {
    case 'oidc':
      configMap = { ...configMap, ...oidcOptions };
      break;
    case 'local':
      configMap = { ...configMap, ...localOptions };
      break;
    default:
      throw new Error('AUTH_MODE is invalid');
  }
  let c: { [key: string]: string | undefined } = {};
  for (const [key, envDesc] of Object.entries(configMap)) {
    let env: string;
    let optional = false;
    if (typeof envDesc === 'string') {
      env = envDesc;
    } else {
      env = envDesc.env;
      optional = !!envDesc.optional;
    }
    const val = process.env[env];
    if (!optional && (!val || val === '')) {
      throw new Error(`Environment variable ${env} must be defined.`);
    }
    c[key] = val;
  }
  return c as Config;
})();

export default config;
