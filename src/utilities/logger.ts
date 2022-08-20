/**
 * @param  {('info'| 'debug' | 'warn' | 'error' )} level
 * @param  {any} log
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Log = (log: unknown, level: ('info'| 'debug' | 'warn' | 'error' | null ) = null) => {
  switch (level) {
    case 'info' :
      console.info(log);
      break;
    case 'debug':
      console.debug(log);
      break;
    case 'warn':
      console.warn(log);
      break;
    case 'error':
      console.error(log);
      break;
    default:
      console.log(log);
      break;
  }
  return null;
};
