import { join } from 'path';
import snowpackSvgr from './index';
import { PluginLoadOptions } from 'snowpack';

describe('snowpack-svgr', () => {
  const snowpackConfig: any = {
    mount: {
      public: { url: '/', static: true },
      src: { url: '/dist' },
    },
    buildOptions: {
      out: 'build',
    },
  };

  it('should compile .svg files', async () => {
    const filePath = join(__dirname, '__fixtures__/test.svg');

    const plugin = snowpackSvgr(snowpackConfig);
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result).toMatchSnapshot();
  });

  it('should be able to use the rollup url plugin', async () => {
    const filePath = join(__dirname, '__fixtures__/test.svg');

    const plugin = snowpackSvgr(snowpackConfig, { rollupUrlPlugin: true });
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result).toMatchSnapshot();
  });

  it('should be able to handle large svg files', async () => {
    const filePath = join(__dirname, '__fixtures__/large.svg');

    const plugin = snowpackSvgr(snowpackConfig, { rollupUrlPlugin: true });
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result['.svg']).toBeDefined();
    expect(result['.js']).toMatchSnapshot();
  });
});
