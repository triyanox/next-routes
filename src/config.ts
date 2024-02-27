import path from 'path';
import { NextRoutesOptions } from './types';

const resolveFromRoot = (...paths: string[]) =>
  path.resolve(process.cwd(), ...paths);

export const __app_dir__ = resolveFromRoot('src/app');
export const __types_dir__ = resolveFromRoot(
  'node_modules/@types',
  'next-routes',
);

const __valid_page_extensions__ = ['.tsx', '.ts', '.js', '.jsx', '.mdx'];
const defaultNextRoutesOptions: NextRoutesOptions = {
  appDir: __app_dir__,
  declarationPath: resolveFromRoot(__types_dir__, 'index.d.ts'),
  utilsPath: resolveFromRoot(__app_dir__, '..', 'lib', 'link$.ts'),
};

export { __valid_page_extensions__, defaultNextRoutesOptions };
