import { IncomingTask } from "../types";

/**
 * @param  {{[key:string]:IncomingTask}|undefined} tasks
 * @returns boolean
 */
 export const IsEmpty = (tasks: { [key: string]: IncomingTask } | undefined): boolean => {
  if (tasks === undefined) return true;
  const objlen = Object.keys(tasks).length;
  if (objlen > 0) return false;
  return true;
};
