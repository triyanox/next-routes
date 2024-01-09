import fs from "fs/promises";
import { getRoutesMap } from "./utils";

const __gen_declarations__ = async (
  appDir: string,
  declarationPath: string,
) => {
  const __path__ = declarationPath;
  const routes_map = await getRoutesMap(appDir);
  const routes_declaration_file = `
const routes = ${JSON.stringify(routes_map, null, 2)};
declare type RoutesOutput = typeof routes;
    `;
  await fs.writeFile(__path__, routes_declaration_file);
};
const __gen_link$__ = async (appDir: string, utilsPath: string) => {
  const __path__ = utilsPath;
  const routes_map = await getRoutesMap(appDir);
  const link_function_file = `
export const routes = ${JSON.stringify(routes_map, null, 2)};
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
      // @ts-ignore
      return acc.replace(${"`[${key}]`, params_values[index]"});
    }, route.path);
  }

  if (query) {
    const queryString = new URLSearchParams(
      query as Record<string, string>,
    ).toString();
    path += ${"`?${queryString}`"};
  }

  if (hash) {
    path += ${"`#${hash}`"};
  }

  return path;
};

export default link$;`;

  await fs.writeFile(__path__, link_function_file);
};

export { __gen_declarations__, __gen_link$__ };
