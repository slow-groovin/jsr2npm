/**
 * options of mirror progress
 */
export type Options = {
  logLevel: string;
  dryRun: boolean;

  dir: string;
  ignoreCurrent: boolean;
  addtionalFields?: string[];
  skipCheck: boolean;
};
