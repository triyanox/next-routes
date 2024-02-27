import fs from 'fs/promises';
import { getRoutesMap } from './utils';

const getRoutesDeclaration = async (appDir: string) => {
  const routes_map = await getRoutesMap(appDir);
  return `const routes = ${JSON.stringify(routes_map, null, 2)};
declare type RoutesOutput = typeof routes;`;
};

const getLinkFunction = async (appDir: string) => {
  const routes_map = await getRoutesMap(appDir);
  return `export const routes = ${JSON.stringify(routes_map, null, 2)};
type IsEmptyObject<T> = keyof T extends never ? true : false;

type Link$Options<T extends keyof RoutesOutput = keyof RoutesOutput> =
  IsEmptyObject<RoutesOutput[T]["params"]> extends false
    ? {
        href: T;
        params: RoutesOutput[T]["params"];
        query?: Record<string, string | number | boolean>;
        hash?: string;
      }
    : {
        href: T;
        params?: RoutesOutput[T]["params"];
        query?: Record<string, string | number | boolean>;
        hash?: string;
      };

type RoutesOutput = typeof routes;

const link$ = <T extends keyof RoutesOutput = keyof RoutesOutput>({
  href,
  params,
  query,
  hash,
}: Link$Options<T>) => {
  const route = routes[href];
  let path = route.path;

  if (route.isDynamic) {
    const params_keys = Object.keys(params!);
    const params_values = Object.values(params!);
    path = params_keys.reduce((acc, key, index) => {
      return acc.replace(${'`[${key}]`, params_values[index] as string'});
    }, route.path);
  }

  if (query) {
    const queryString = new URLSearchParams(
      query as Record<string, string>,
    ).toString();
    path += ${'`?${queryString}`'};
  }

  if (hash) {
    path += ${'`#${hash}`'};
  }

  return path;
};

export default link$;`;
};

const writeFile = async (path: string, data: string) => {
  await fs.writeFile(path, data);
};

const __gen_declarations__ = async (
  appDir: string,
  declarationPath: string,
) => {
  const routes_declaration_file = await getRoutesDeclaration(appDir);
  await writeFile(declarationPath, routes_declaration_file);
};

const __gen_link$__ = async (appDir: string, utilsPath: string) => {
  const link_function_file = await getLinkFunction(appDir);
  await writeFile(utilsPath, link_function_file);
};

export { __gen_declarations__, __gen_link$__ };
