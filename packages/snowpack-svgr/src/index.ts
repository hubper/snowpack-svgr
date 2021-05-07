import { promises as fs } from 'fs';
// @ts-expect-error
import svgr from '@svgr/rollup';
// @ts-expect-error
import url from '@rollup/plugin-url';
import { PluginLoadOptions, SnowpackConfig } from 'snowpack';
// @ts-expect-error
import convert from '@svgr/core';
// @ts-expect-error
import svgo from '@svgr/plugin-svgo';
// @ts-expect-error
import jsx from '@svgr/plugin-jsx';
import * as babel from '@babel/core';
// @ts-expect-error
import presetReact from '@babel/preset-react';
// @ts-expect-error
import presetEnv from '@babel/preset-env';
// @ts-expect-error
import pluginTransformReactConstantElements from '@babel/plugin-transform-react-constant-elements';

const babelOptions = {
  babelrc: false,
  configFile: false,
  presets: [
    babel.createConfigItem(presetReact, { type: 'preset' }),
    babel.createConfigItem([presetEnv, { modules: false }], { type: 'preset' }),
  ],
  plugins: [babel.createConfigItem(pluginTransformReactConstantElements)],
};

type SnowpackSVGROptions = {
  exportUrlAsDefault?: boolean;
  svgrOptions?: Record<string, unknown>;
};

function snowpackSvgr(
  snowpackConfig: SnowpackConfig,
  { svgrOptions = {}, exportUrlAsDefault = false }: SnowpackSVGROptions = {}
) {
  return {
    name: 'snowpack-svgr',
    resolve: {
      input: ['.svg'],
      output: ['.js', '.svg'],
    },
    async load({ filePath, fileExt }: PluginLoadOptions) {
      let publicPath = '';

      for (const [start, { url }] of Object.entries(snowpackConfig.mount)) {
        if (filePath.startsWith(start)) {
          publicPath = filePath.replace(start, url);
        }
      }

      const contents = await fs.readFile(filePath, 'utf-8');
      const code = (
        await convert(
          contents,
          {
            svgo: true,
            ref: true,
            ...svgrOptions,
          },
          {
            caller: {
              name: 'snowpack-svgr',
              defaultPlugins: [svgo, jsx],
            },
            filePath,
          }
        )
      )
        // Snowpack doesn't like these imports for React
        .replace('import * as React', 'import React');

      const config = babel.loadPartialConfig({
        filename: filePath,
        ...babelOptions,
        // ...pluginOptions.babelOptions,
      });
      const transformOptions = config?.options;
      let { code: result = '' } =
        (await babel.transformAsync(code, transformOptions)) || {};

      if (exportUrlAsDefault) {
        result = result!.replace(
          /export default (.+);/,
          `export default "${publicPath}${fileExt}"; export { $1 as ReactComponent };`
        );

        return {
          '.js': result,
          '.svg': await fs.readFile(filePath),
        };
      }

      return {
        '.js': result,
      };
    },
  };
}

export default snowpackSvgr;
