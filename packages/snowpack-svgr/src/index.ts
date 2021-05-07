import { promises as fs } from 'fs';
import { Plugin, rollup, RollupOptions } from 'rollup';
// @ts-expect-error
import svgr from '@svgr/rollup';
// @ts-expect-error
import url from '@rollup/plugin-url';
import { PluginLoadOptions, SnowpackConfig } from 'snowpack';
import { posix } from 'path';

type SnowpackSVGROptions = {
  rollupUrlPlugin?: boolean;
  svgrOptions?: Record<string, unknown>;
  rollupOptions?: RollupOptions;
};

function snowpackSvgr(
  snowpackConfig: SnowpackConfig,
  {
    rollupUrlPlugin = false,
    svgrOptions = {},
    rollupOptions = {},
  }: SnowpackSVGROptions = {}
) {
  return {
    name: 'snowpack-svgr',
    resolve: {
      input: ['.svg'],
      output: ['.js', '.svg'],
    },
    async load({ filePath }: PluginLoadOptions) {
      let plugins: Plugin[] = [
        svgr({
          svgo: true,
          ref: true,
          ...svgrOptions,
        }),
      ];

      if (rollupUrlPlugin) {
        let publicPath = posix.sep;

        for (const [start, { url }] of Object.entries(snowpackConfig.mount)) {
          if (filePath.startsWith(start)) {
            publicPath = url + publicPath;
          }
        }

        plugins.unshift(
          url({
            emitFiles: false,
            destDir: snowpackConfig.buildOptions.out,
            publicPath,
            fileName: '[name][extname][extname]',
          })
        );
      }

      const bundle = await rollup({
        input: filePath,
        external: ['react'],
        plugins: [...plugins, ...(rollupOptions.plugins ?? [])],
        ...rollupOptions,
      });

      const { output } = await bundle.generate({
        format: 'es',
      });

      const result = output[0].code.replace(
        'import * as React',
        'import React'
      );

      if (rollupUrlPlugin) {
        const isBase64 = result.includes('data:image/svg+xml');

        if (isBase64) {
          return {
            '.js': result,
          };
        }

        return {
          '.js': result,
          '.svg': await fs.readFile(filePath),
        };
      }

      return {
        '[.js]': result,
      };
    },
  };
}

export default snowpackSvgr;
