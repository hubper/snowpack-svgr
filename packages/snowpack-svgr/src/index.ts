import { promises as fs } from 'fs';
import * as path from 'path';
import * as mime from 'mime';
import { getUrlForFile, PluginLoadOptions, SnowpackConfig } from 'snowpack';
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

async function encode(file: string, name: string) {
  const encoding = 'binary';
  if (path.isAbsolute(file)) {
    file = await fs.readFile(file, encoding);
  }

  if (file.length > 10240) {
    return;
  }

  const mimetype = mime.getType(name);
  const buffer = Buffer.from(file, encoding);
  return `data:${mimetype || ''};base64,${buffer.toString('base64')}`;
}

type SnowpackSVGROptions = {
  exportUrlAsDefault?: boolean;
  svgrOptions?: Record<string, unknown>;
  babelOptions?: babel.TransformOptions;
};

function snowpackSvgr(
  snowpackConfig: SnowpackConfig,
  {
    exportUrlAsDefault = false,
    svgrOptions = {},
    babelOptions = {},
  }: SnowpackSVGROptions = {}
) {
  return {
    name: 'snowpack-svgr',
    resolve: {
      input: ['.svg'],
      output: ['.js', '.svg'],
    },
    async load({ filePath }: PluginLoadOptions) {
      const contents = await fs.readFile(filePath, 'utf-8');
      const code = (
        await convert(
          contents,
          {
            svgo: true,
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
      ).replace('import * as React', 'import React');

      const config = babel.loadPartialConfig({
        filename: filePath,
        babelrc: false,
        configFile: false,
        presets: [
          babel.createConfigItem(presetReact, { type: 'preset' }),
          babel.createConfigItem([presetEnv, { modules: false }], {
            type: 'preset',
          }),
        ],
        plugins: [babel.createConfigItem(pluginTransformReactConstantElements)],
        ...babelOptions,
      });
      const transformOptions = config?.options;

      const transform = await babel.transformAsync(code, transformOptions);

      let result = transform?.code ?? '';

      if (exportUrlAsDefault) {
        const encodedUrl = await encode(filePath, filePath);

        const uri = encodedUrl
          ? encodedUrl
          : (getUrlForFile(filePath, snowpackConfig) ?? '').replace(
              '.js',
              '.svg'
            );

        if (!uri) {
          console.error(`No url found for ${filePath}`);
        }

        result = result.replace(
          /export default (.+);/,
          `export default "${uri}"; export { $1 as ReactComponent };`
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
