import type { User as UserEntity } from '@entities';
import type { I18nTranslations as I18nTranslationTypes } from '@generated';
import type { Config as ConfigInterface } from '@lib/config/config.interface';
import type { NextFunction, Request, Response } from 'express';

// `export {}` indicate file as a module and export nothing, often used in TypeScript file only
// contain type declarations or interfaces, without any code or exports
export {};

declare global {
  namespace Express {
    export interface Request {
      realIp?: string
      idx?: string
      ip: string
      i18nLang?: string
      ips: string[]

    }
    interface User extends UserEntity {

    }
  }

  export type I18nTranslations = I18nTranslationTypes;
  export type Configs = ConfigInterface;

  // Using this allows is to quickly switch between express and fastify and others
  export type NestifyRequest = Request;
  export type NestifyResponse = Response;
  export type NestifyNextFunction = NextFunction;
}

