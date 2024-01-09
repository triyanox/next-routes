import chalk from "chalk";
import { watch } from "chokidar";
import fs from "fs";
import {
  NextJsWebpackConfig,
  WebpackConfigContext,
} from "next/dist/server/config-shared";
import type { Compiler, WebpackPluginInstance } from "webpack";
import { __gen_declarations__, __gen_link$__ } from "./codegen";
import { __types_dir__ } from "./config";
import { NextRoutesOptions } from "./types";

class NextRoutesPlugin implements WebpackPluginInstance {
  name = "NextRoutesPlugin";

  constructor(
    private config: NextJsWebpackConfig,
    private readonly options: WebpackConfigContext,
    private nextRoutesOptions: NextRoutesOptions,
  ) {}

  async generateRoutes() {
    const { appDir, declarationPath, utilsPath } = this.nextRoutesOptions;
    console.log(chalk.cyanBright(`🚀 Generating routes...`));
    if (!fs.existsSync(__types_dir__)) {
      console.log(chalk.greenBright(`📦 Creating ${__types_dir__}...`));
      fs.mkdirSync(__types_dir__);
    }
    console.log(chalk.cyanBright(`📦 Emitting declaration file...`));
    await __gen_declarations__(appDir, declarationPath);
    console.log(chalk.greenBright(`📦 Declaration file emitted!`));
    if (!fs.existsSync(utilsPath.split("/").slice(0, -1).join("/"))) {
      console.log(
        chalk.cyanBright(
          `🤩 Creating ${utilsPath.split("/").slice(0, -1).join("/")}...`,
        ),
      );
      fs.mkdirSync(utilsPath.split("/").slice(0, -1).join("/"));
    }
    await __gen_link$__(appDir, utilsPath);
    if (process.env.NODE_ENV === "development") {
      const watcher = watch(appDir, {
        ignored: [/node_modules/, /(^|[\/\\])\../, /(^|[\/\\])_/],
        persistent: true,
      });
      watcher.on("ready", () => {
        console.log(chalk.cyanBright(`👀 Watching the app directory...`));
      });

      let changedFiles = new Set();
      let regenerateTimeout: NodeJS.Timeout;

      const regenerateRoutes = async () => {
        console.log(
          chalk.cyanBright(
            `🚀 Regenerating routes for ${changedFiles.size} changed files...`,
          ),
        );
        await __gen_declarations__(appDir, declarationPath);
        await __gen_link$__(appDir, utilsPath);
        changedFiles.clear();
      };

      const scheduleRegenerateRoutes = (path: string) => {
        changedFiles.add(path);
        clearTimeout(regenerateTimeout);
        regenerateTimeout = setTimeout(() => {
          regenerateRoutes();
        }, 300);
      };

      watcher.on("all", (event, path) => {
        if (event === "add" || event === "unlink") {
          scheduleRegenerateRoutes(path);
        }
      });

      process.on("SIGINT", () => {
        watcher.close();
        process.exit();
      });
      process.on("SIGTERM", () => {
        watcher.close();
        process.exit();
      });
      process.on("exit", () => {
        watcher.close();
      });
    }
  }

  apply(compiler: Compiler) {
    this.generateRoutes().then(() => {
      console.log(chalk.greenBright(`🚀 Routes generated!`));
    });
  }
}

export default NextRoutesPlugin;
