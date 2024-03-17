# `@triyanox/next-routes` - Never worry about broken links in your Next.js app again!

`@triyanox/next-routes` is a powerful plugin for Next.js that ensures your application's links are always valid. It generates routes and utilities for your application, making link management a breeze.

## Roadmap

- [x] Support TypeScript out of the box
- [x] Support Next.js 13+ app directory structure
- [x] Generate routes and utilities for your application
- [x] Support static routes (e.g. `/about`)
- [x] Support dynamic routes (e.g. `/[slug]`)
- [x] Support route groups (e.g. `(auth)/login`)
- [ ] Support catch-all routes (e.g. `/[...slug]`)
- [ ] Support optional catch-all routes (e.g. `/[[...slug]]`)
- [ ] more features coming soon...

## Installation

Install `@triyanox/next-routes` using your favorite package manager:

```bash
# pnpm
pnpm add @triyanox/next-routes

# bun
bun add @triyanox/next-routes

# npm
npm i @triyanox/next-routes

# yarn
yarn add @triyanox/next-routes
```

## Usage

### Basic Setup

1. In your `next.config.js` file, add the following:

```js
import withRoutes from '@triyanox/next-routes';

const config = withRoutes({
  //... your next config
});

export default config;
```

2. Import link$ function from @/lib and use it in your components:

```js
import link$ from '@/lib';
import Link from 'next/link';

const MyComponent = () => {
  return (
    <Link
      href={link$({
        path: '/[slug]',
        params: {
          slug: 'home',
        },
        hash: 'my-hash',
        query: {
          foo: 'bar',
        },
      })}
    >
      Home
    </Link>
  );
};
```

3. Run your app and enjoy!

### Advanced Setup

You can customize the behavior of `@triyanox/next-routes` by passing an options object to the `withRoutes` function. Here's an example:

```js
import withRoutes from '@triyanox/next-routes';
import path from 'path';
import { cwd } from 'process';

// this is an example not using the `src` directory
const config = withRoutes(
  {
    //... your next config
  },
  {
    appDir: path.resolve(cwd(), './app'),
    declarationPath: path.resolve(
      cwd(),
      './node_modules/@types/next-routes/index.d.ts',
    ),
    utilsPath: path.resolve(cwd(), './lib.ts'),
  },
);

export default config;
```

In this example, the appDir, declarationPath, and utilsPath options are used to customize the behavior of `@triyanox/next-routes`.

### Contributing

Contributions are welcome! Please read our contributing guidelines for more information.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
