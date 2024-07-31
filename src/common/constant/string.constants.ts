import { capitalize, getPackageJson } from '../helpers/fn.utils';

const packageJson = getPackageJson();

export const APP_NAME = packageJson.name;
export const SWAGGER_API_CURRENT_VERSION = packageJson.version;
export const SWAGGER_DESCRIPTION = packageJson.description!;
export const SWAGGER_TITLE = `${capitalize(APP_NAME)} API Documentation}`;
export const SWAGGER_API_ENDPOINT = 'doc';
