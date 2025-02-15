import type { Config as ConfigInterface } from '../../lib/config/configs/config.interace';

// `export {}` indicate file as a module and export nothing, often used in TypeScript file only
// contain type declarations or interfaces, without any code or exports
export {};

declare global {
  namespace Express {
    export interface Request {
      realIp?: string;
      idx?: string;
      ip: string;
      i18nLang: string;
      ips: string[];
    }
  }
}

export type Configs = ConfigInterface;
