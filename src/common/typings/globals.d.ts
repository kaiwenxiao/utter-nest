import type { Config as ConfigInterface } from '../../lib/config/configs/config.interace';

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
