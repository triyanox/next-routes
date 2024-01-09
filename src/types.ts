type IFSTreeWalker = {
  base: string;
  paths: IFSTreeWalker[];
};

type IRoute<
  T extends string = string,
  P extends { [key: string]: string } = { [key: string]: string },
> = {
  path: T;
  params: P;
  isDynamic: boolean;
};

type NextRoutesOptions = {
  appDir: string;
  declarationPath: string;
  utilsPath: string;
};

export type { IFSTreeWalker, IRoute, NextRoutesOptions };
