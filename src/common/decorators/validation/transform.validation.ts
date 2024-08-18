import { Transform } from 'class-transformer';
import { isArray, isString } from '@common/helpers/validator.utils';
import DOMPurify from 'isomorphic-dompurify';

// TODO
export function Trim() {
  return Transform((parameters) => {
    const value = parameters.value as string[] | string;

    if (isArray(value)) {
      return value.map((v: string) => v.trim().replaceAll(/\s\s+/g, ' '));
    }

    return value.trim().replaceAll(/\s\s+/g, ' ');
  });
}

export const Sanitize: () => PropertyDecorator = () => {
  return Transform(
    ({ value }: { value: unknown }) => {
      if (isArray(value)) {
        return value.map((v) => {
          if (isString(v)) {
            return DOMPurify.sanitize(v);
          }

          return v;
        });
      }

      if (isString(value)) {
        return DOMPurify.sanitize(value);
      }

      return value;
    },
    { toClassOnly: true },
  );
};

export function ToBoolean() {
  return Transform(
    (parameters) => {
      switch (parameters.value) {
        case 'true': {
          return true;
        }

        case 'false': {
          return false;
        }

        default: {
          return parameters.value as boolean;
        }
      }
    },
    { toClassOnly: true },
  );
}
