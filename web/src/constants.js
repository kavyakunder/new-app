// Make sure to import the helper functions from the `ssr` entry point.
// import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr/dist/commercetools-frontend-application-shell-ssr.cjs.js';

export const entryPointUriPath = 'chatbot';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
