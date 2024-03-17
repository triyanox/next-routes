import fs from 'fs/promises';
import path from 'path';
import { __app_dir__, __valid_page_extensions__ } from './config';
import { IFSTreeWalker, IRoute } from './types';

const cleanPath = (path: string, appDir: string = __app_dir__): string => {
  return path
    .replace(appDir, '')
    .replace(/\(.*\)/g, '')
    .replace(/\/$/, '')
    .replace(/^\/\//, '/')
    .replace(/\.[a-z]+$/, '')
    .replace(/\/page$/, '')
    .replace(/\/{2,}/g, '/');
};

const isValidPath = (p: string) => !p.startsWith('_') && !p.startsWith('.');

const walk = async (dir: string): Promise<IFSTreeWalker> => {
  const paths = await fs.readdir(dir);
  const tree: IFSTreeWalker = {
    base: dir,
    paths: [],
  };

  for (const p of paths) {
    const fullPath = path.join(dir, p);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory() && isValidPath(p)) {
      tree.paths.push(await walk(fullPath));
    } else {
      tree.paths.push({
        base: fullPath,
        paths: [],
      });
    }
  }
  return tree;
};

const isDynamicPath = (base: string) =>
  base.includes('[') && base.includes(']');

const generateRoutes = async (appDir: string): Promise<IRoute[]> => {
  const tree = await walk(appDir);
  const routes: IRoute[] = [];

  const traverse = (tree: IFSTreeWalker) => {
    for (const path of tree.paths) {
      const { base } = path;
      const isDynamic = isDynamicPath(base);
      const params = isDynamic
        ? Object.fromEntries(
            base
              .match(/\[(.*?)\]/g)!
              .map((param) => param.replace(/\[|\]/g, ''))
              .map((param) => [param, '']),
          )
        : {};

      routes.push({
        path: base,
        isDynamic,
        params,
      });

      traverse(path);
    }
  };

  traverse(tree);

  const routes_generated = routes
    .filter((route) => {
      const { path } = route;
      const name = path.split('/').pop();
      const ext = name?.split('.').pop();
      return (
        __valid_page_extensions__.includes('.' + ext!) &&
        name!.split('.').shift() === 'page'
      );
    })
    .map((route) => ({
      ...route,
      path: cleanPath(route.path, appDir),
    }));

  routes_generated.push({
    path: '/',
    params: {},
    isDynamic: false,
  });

  return routes_generated;
};

const getRoutesMap = async (appDir: string) => {
  const routes = await generateRoutes(appDir);
  return Object.fromEntries(routes.map((route) => [route.path, route]));
};

export { cleanPath, generateRoutes, getRoutesMap, walk };
