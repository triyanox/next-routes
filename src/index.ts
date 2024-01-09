import { NextConfig } from 'next';
import { defaultNextRoutesOptions } from './config';
import NextRoutesPlugin from './next-plugin';
import { NextRoutesOptions } from './types';

/**
 * @module @triyanox/next-routes
 */

/**
 * @description
 * `@triyanox/next-routes` is a powerful plugin for Next.js that ensures your application's links are always valid. It generates routes and utilities for your application, making link management a breeze.
 *
 * ## Roadmap
 *
 * - [x] Support TypeScript out of the box
 * - [x] Support Next.js 13+ app directory structure
 * - [x] Generate routes and utilities for your application
 * - [x] Support static routes (e.g. `/about`)
 * - [x] Support dynamic routes (e.g. `/[slug]`)
 * - [x] Support route groups (e.g. `(auth)/login`)
 * - [ ] Support catch-all routes (e.g. `/[...slug]`)
 * - [ ] Support optional catch-all routes (e.g. `/[[...slug]]`)
 * - [ ] more features coming soon...
 *
 *
 * @example
 * // Basic Setup
 *
 * // 1. In your `next.config.js` file, add the following:
 * import withRoutes from "@triyanox/next-routes";
 *
 * const config = withRoutes({
 *   //... your next config
 * });
 *
 * export default config;
 *
 * // 2. Import link$ function from @/lib and use it in your components:
 * import link$ from "@/lib";
 * import Link from "next/link";
 *
 * const MyComponent = () => {
 *   return (
 *     <Link
 *       href={link$({
 *         path: "/[slug]",
 *         params: {
 *           slug: "home",
 *         },
 *         hash: "my-hash",
 *         query: {
 *           foo: "bar",
 *         },
 *       })}
 *     >
 *       Home
 *     </Link>
 *   );
 * };
 *
 * // 3. Run your app and enjoy!
 *
 * @example
 * // Advanced Setup
 *
 * // You can customize the behavior of `@triyanox/next-routes` by passing an options object to the `withRoutes` function. Here's an example:
 * import withRoutes from "@triyanox/next-routes";
 *
 * const config = withRoutes(
 *   {
 *     //... your next config
 *   },
 *   {
 *     appDir: "src/app", // The path to your Next.js app directory. Defaults to "./src/app".
 *     declarationPath: "node_modules/@types/next-routes/index.d.ts", // The path where the plugin will generate the declaration file. Defaults to "node_modules/@types/next-routes/index.d.ts".
 *     utilsPath: "src/lib/link$.ts", // The path where the plugin will generate utility functions. Defaults to "src/lib/link$.ts".
 *   },
 * );
 *
 * export default config;
 *
 * // In this example, the appDir, declarationPath, and utilsPath options are used to customize the behavior of `@triyanox/next-routes`.
 *
 * @see {@link https://github.com/triyanox/next-routes | GitHub Repository}
 */
const WithNextRoutes = (
  nextConfig: NextConfig,
  nextRoutesOptions?: Partial<NextRoutesOptions>,
) => {
  return {
    ...nextConfig,
    webpack: (config, options) => {
      const { appDir, declarationPath, utilsPath } = {
        ...defaultNextRoutesOptions,
        ...nextRoutesOptions,
      };
      config.plugins = config.plugins ?? [];
      if (options.isServer) {
        config.plugins.push(
          new NextRoutesPlugin(config, options, {
            appDir,
            declarationPath,
            utilsPath,
          }),
        );
      }
      if (nextConfig.webpack) {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  } as NextConfig;
};

export default WithNextRoutes;
