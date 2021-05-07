import { join } from 'path';
import snowpackSvgr from './index';

describe('snowpack-svgr', () => {
  it('should compile .svg files', async () => {
    const filePath = join(__dirname, '__fixtures__/test.svg');

    const plugin = snowpackSvgr({});
    const result = await plugin.load({ filePath, fileExt: '.svg' });

    expect(result).toMatchSnapshot();
  });

  it('should be able to use the rollup url plugin', async () => {
    const filePath = join(__dirname, '__fixtures__/test.svg');

    const plugin = snowpackSvgr({}, { rollupUrlPlugin: true });
    const result = await plugin.load({ filePath, fileExt: '.svg' });

    expect(result).toMatchSnapshot();
  });

  it('should be able to handle large svg files', async () => {
    const filePath = join(__dirname, '__fixtures__/large.svg');

    const plugin = snowpackSvgr(
      {
        buildOptions: {
          out: 'build',
        },
      },
      { rollupUrlPlugin: true }
    );
    const result = await plugin.load({ filePath, fileExt: '.svg' });

    expect(result).toMatchSnapshot();
  });
});
