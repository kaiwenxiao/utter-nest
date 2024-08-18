import type { I18nTranslations } from '@generated';
import {
  I18nContext,
  i18nValidationMessage,
  Path,
  TranslateOptions,
} from 'nestjs-i18n';

export const itemDoesNotExistKey: Path<I18nTranslations> =
  'exception.itemDoesNotExist';

export function translate(
  key: Path<I18nTranslations>,
  options: TranslateOptions = {},
) {
  const i18nContext = I18nContext.current<I18nTranslations>();

  if (i18nContext) {
    return i18nContext.t(key, options);
  }

  return '';
}

export function validationI18nMessage(
  key: Path<I18nTranslations>,
  arguments_?: any,
) {
  return i18nValidationMessage(key, arguments_);
}
