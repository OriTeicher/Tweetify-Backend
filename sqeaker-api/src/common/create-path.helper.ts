import 'fs';
import { join } from 'path';

export const createPath = (...path: string[]) => {
  return join(...path);
};
