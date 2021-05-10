import { join } from 'path';
import snowpackSvgr from './index';
import { PluginLoadOptions } from 'snowpack';

describe('snowpack-svgr', () => {
  const snowpackConfig: any = {
    mount: {
      [__dirname]: { url: '/dist' },
    },
    buildOptions: {
      out: 'build',
    },
  };

  const filePath = join(__dirname, '__fixtures__/test.svg');
  const svgrOptions = {
    ref: true,
  };

  it('should compile .svg files', async () => {
    const plugin = snowpackSvgr(snowpackConfig, { svgrOptions });
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result).toMatchSnapshot();
  });

  it('should be to export the url as default export', async () => {
    const plugin = snowpackSvgr(snowpackConfig, {
      exportUrlAsDefault: true,
      svgrOptions,
    });
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result['.svg']).toBeDefined();
    expect(result['.js']).toMatchSnapshot();
  });
});
