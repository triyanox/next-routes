import { NextConfig } from 'next';
import { defaultNextRoutesOptions } from './config';
import NextRoutesPlugin from './next-plugin';
import { NextRoutesOptions } from './types';

/**
 * @module @triyanox/next-routes
 * @description A powerful plugin for Next.js that ensures your application's links are always valid.
 * It generates routes and utilities for your application, making link management a breeze.
 * 
 * @example
 * // Basic Setup
 * // If you are using the `src` directory you can simply wrap your config with `withRoutes`
 * import withRoutes from '@triyanox/next-routes';
 * 
 * const config = withRoutes({
 *   //... your next config
 * });
 * 
 * export default config;
 * 
 * // Advanced Setup
 * // if you are not using the `src` directory you can override the default options
 * import withRoutes from '@triyanox/next-routes';
 * import path from 'path';
 * import { cwd } from 'process';
 * 
 * const config = withRoutes(
 *   {
 *     //... your next config
 *   },
 *   {
 *     appDir: path.resolve(cwd(), './app'),
 *     declarationPath: path.resolve(
 *       cwd(),
 *       './node_modules/@types/next-routes/index.d.ts',
 *     ),
 *     utilsPath: path.resolve(cwd(), './lib.ts'),
 *   },
 * );
 * 
 * export default config;
 * 
 * // Usage in components
 * import link$ from '@/lib';
 * import Link from 'next/link';
 * 
 * const MyComponent = () => {
 *   return (
 *     <Link
 *       href={link$({
 *           path: '/blog/[slug]',
 *           params: {
 *             slug: 'post-id',
 *           },
 *           hash: 'my-hash',
 *           query: {
 *             foo: 'bar',
 *           },
 *       })}
 *     >
 *       Post
 *     </Link>
 *   );
 * };
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
