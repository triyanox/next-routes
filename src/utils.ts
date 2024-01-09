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
const walk = async (dir: string): Promise<IFSTreeWalker> => {
  const paths = await fs.readdir(dir);
  const tree: IFSTreeWalker = {
    base: dir,
    paths: [],
  };

  const valid_path_rules = [
    (p: string) => !p.startsWith('_'),
    (p: string) => !p.startsWith('.'),
  ];

  for (const p of paths) {
    const stat = await fs.stat(path.join(dir, p));
    if (stat.isDirectory()) {
      if (!valid_path_rules.every((rule) => rule(p))) {
        continue;
      }
      tree.paths.push(await walk(path.join(dir, p)));
    } else {
      tree.paths.push({
        base: path.join(dir, p),
        paths: [],
      });
    }
  }
  return tree;
};
const generateRoutes = async (appDir: string): Promise<IRoute[]> => {
  const tree = await walk(appDir);
  const routes: IRoute[] = [];
  const traverse = (
    tree: IFSTreeWalker,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: { [key: string]: string },
  ) => {
    for (const path of tree.paths) {
      const { base } = path;
      const isDynamic = base.includes('[') && base.includes(']');
      const params = isDynamic
        ? Object.fromEntries(
            base
              .match(/\[(.*?)\]/g)!
              .map((param) => param.replace(/\[|\]/g, ''))
              .map((param) => [param, '']),
          )
        : {};

      let route = {
        path: base,
        params,
        isDynamic,
      } as IRoute;

      if (!isDynamic) {
        route = {
          path: base,
          isDynamic,
          params: {},
        };
      }

      routes.push(route);
      traverse(path, { ...params, ...route.params });
    }
  };
  traverse(tree, {});
  const routes_generated = routes

    .filter((route) => {
      const { path } = route;
      const name = path.split('/').pop();
      const ext = name?.split('.').pop();
      const is_valid =
        __valid_page_extensions__.includes('.' + ext!) &&
        name!.split('.').shift() === 'page';
      return is_valid;
    })
    .map((route) => ({
      ...route,
      path: cleanPath(route.path),
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
  const routes_map = Object.fromEntries(
    routes.map((route) => [route.path, route]),
  );
  return routes_map;
};

export { cleanPath, generateRoutes, getRoutesMap, walk };
