import { PERMISSIONS, entryPointUriPath } from './src/constants.js';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Chatbot',
  entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:CTP_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APP_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'home',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
  headers: {
    permissionsPolicies: {
      microphone: '*',
    },
    csp: {
      'connect-src': [
        'https://766iuautdb.execute-api.ap-southeast-2.amazonaws.com/dev//ai',
        "'self'",
        'https://*.commercetools.com',
        'app.launchdarkly.com',
        'clientstream.launchdarkly.com',
        'events.launchdarkly.com',
        'app.getsentry.com',
        '*.sentry.io',
        'ws:',
        'localhost:8080',
        'webpack-internal:',
        'https',
        'https://mc.australia-southeast1.gcp.commercetools.com/*',
      ],
    },
  },
};

export default config;
