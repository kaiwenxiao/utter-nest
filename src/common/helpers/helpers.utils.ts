export const HelperService = {
  isDev() {
    return process.env.NODE_ENV.startsWith('dev');
  },

  isProd() {
    return process.env.NODE_ENV.startsWith('prod');
  },
};
