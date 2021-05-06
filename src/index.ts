import {Plugin, rollup} from 'rollup';
// @ts-expect-error
import svgr from '@svgr/rollup';
// @ts-expect-error
import url from '@rollup/plugin-url';

type SnowpackSVGROptions = {
  rollupUrlPlugin?: boolean;
  svgrOptions?: Record<string, unknown>;
};

function snowpackSvgr(
    snowpackOptions: any,
    {rollupUrlPlugin, svgrOptions}: SnowpackSVGROptions = {}
) {
  return {
    name: 'snowpack-svgr',
    resolve: {
      input: ['.svg'],
      output: ['.js'],
    },
    async load({filePath}: {filePath: string}) {
      let plugins: Plugin[] = [
        svgr({
          svgo: true,
          ref: true,
          ...svgrOptions,
        }),
      ];

      if (rollupUrlPlugin) {
        plugins.unshift(
            url({
              destDir: `${snowpackOptions?.buildOptions?.out}/svgr`,
            })
        );
      }

      const bundle = await rollup({
        input: filePath,
        plugins,
      });

      const {output} = await bundle.generate({
        format: 'es',
      });

      const result = output[0].code.replace(
          'import * as React',
          'import React'
      );

      return {
        '.js': result,
      };
    },
  };
}

export default snowpackSvgr;
