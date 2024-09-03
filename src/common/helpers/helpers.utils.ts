import { format, fromZonedTime } from 'date-fns-tz';
import { argon2id, hash, Options as ArgonOptions } from 'argon2';

interface ISlugifyOptions {
  separator?: string;
}

const argon2Options: ArgonOptions & { raw?: false } = {
  type: argon2id,
  hashLength: 50,
  timeCost: 4,
};

export const HelperService = {
  isDev() {
    return process.env.NODE_ENV!.startsWith('dev');
  },

  isProd() {
    return process.env.NODE_ENV!.startsWith('prod');
  },

  getTimeInUtc(date: Date | string): Date {
    const thatDate = date instanceof Date ? date : new Date(date);
    const currentUtcTime = fromZonedTime(thatDate, 'UTC');

    return new Date(format(currentUtcTime, 'yyyy-MM-dd HH:mm:ss'));
  },

  slugify(string_: string, options?: ISlugifyOptions): string {
    const { separator = '-' } = options ?? {};

    return string_
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(/[^\d a-z-]/g, '')
      .replaceAll(/\s+/g, separator);
  },

  hashString(userPassword: string): Promise<string> {
    return hash(userPassword, argon2Options);
  },
};
