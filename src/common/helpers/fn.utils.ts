import * as path from 'node:path';
import * as fs from 'node:fs';
import { isString } from './validator.utils';
import { IPackageJson } from './type';

export function capitalize(string_: string) {
  return string_
    ? string_.charAt(0).toUpperCase() + string_.slice(1).toLowerCase()
    : '';
}

export function defaultCheck(directory: string) {
  return fs.existsSync(path.join(directory, 'package.json'));
}

export function findRootPath(
  start: string | string[] = module.filename,
  check = defaultCheck,
) {
  if (isString(start)) {
    start = start.endsWith(path.sep) ? start : start + path.sep;
    start = start.split(path.sep);
  }

  if (!start.length) {
    throw new Error('package.json not found in path.');
  }

  start.pop();
  const directory = start.join(path.sep);

  if (check(directory)) {
    return directory;
  }

  return findRootPath(start, check);
}

export function getPackageJson(directory?: string) {
  const rootPath = directory ? path.resolve(directory) : findRootPath();
  const packageJsonPath = path.join(rootPath, 'package.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonPath) as IPackageJson;
  return packageJson;
}

export function enumToString<T extends Record<string, string>>(
  _enum: T,
): string {
  return Object.keys(_enum)
    .map((key) => _enum[key])
    .join(',');
}

export function formatSearch(search: string) {
  return `%${search.trim().replaceAll('\n', ' ').replaceAll(/\s\s+/g, ' ').toLowerCase()}%`;
}
