import { join } from 'path';
import snowpackSvgr from './index';
import { createConfiguration, PluginLoadOptions } from 'snowpack';

describe('snowpack-svgr', () => {
  const filePath = join(__dirname, '__fixtures__/test.svg');
  const svgrOptions = {
    ref: true,
  };

  it('should compile .svg files', async () => {
    const plugin = snowpackSvgr(
      createConfiguration({
        mount: {
          src: { url: '/dist' },
        },
        plugins: ['snowpack-svgr'],
      })
    );
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result['.js']).toMatchSnapshot();
  });

  it('should be to export the url as default export', async () => {
    const plugin = snowpackSvgr(
      createConfiguration({
        mount: {
          src: { url: '/dist' },
        },
        plugins: ['snowpack-svgr'],
      }),
      { exportUrlAsDefault: true, svgrOptions }
    );
    const result = await plugin.load({
      filePath,
      fileExt: '.svg',
    } as PluginLoadOptions);

    expect(result['.svg']).toBeDefined();
    expect(result['.js']).toMatchSnapshot();
  });
});
