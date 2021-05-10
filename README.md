# snowpack-svgr

> Snowpack plugin to transform your React components using [svgr](https://github.com/gregberge/svgr)


<p>
  <a aria-label="Types" href="https://www.npmjs.com/package/snowpack-svgr">
    <img alt="Types" src="https://img.shields.io/npm/types/snowpack-svgr?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/snowpack-svgr">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/snowpack-svgr?style=for-the-badge&labelColor=24292e">
  </a>
</p>

## Install

```sh
yarn add -D snowpack-svgr
```

```js
// snowpack.config.json

{
    plugins: [["snowpack-svgr", { /** SnowpackSVGROptions */ }]
}
```

```ts
type SnowpackSVGROptions = {
    /**
     * If true the default export will be the url of the asset.
     * The ReactComponent will be exported via the ReactComponent named export
     */
    exportUrlAsDefault?: boolean; // false
    /**
     * Options used by @svgr/core
     * @see See: https://react-svgr.com/docs/options/
     */
    svgrOptions?: Record<string, unknown>; // {}
    /**
     * Options used by babel.loadPartialConfig()
     */
    babelOptions?: babel.TransformOptions; // {}
}
```

## Usage

By default the plugin will export a React component when importing a .svg file

```tsx
import Image from "./image.svg";

<Image {...props} />
```

When the option `exportUrlAsDefault` is `true`. The plugin will make sure the default export is the url to the SVG asset. The ReactComponent will be exported by the `ReactComponent` named export.

```tsx
import imageUrl, { ReactComponent as Image } from "./image.svg";

<>
 The <Image {...props} /> can be found at {imageUrl}
</>
```

## Types

Modify your `types/static.d.ts` file accordingly.

```ts
// replace
declare module '*.svg' {
  const ref: string
  export default ref
}

// exportUrlAsDefault: true
declare module "*.svg" {
  export const ReactComponent: React.ForwardRefRenderFunction<
      SVGSVGElement,
      React.SVGAttributes<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

// exportUrlAsDefault: false
declare module "*.svg" {
    const ReactComponent: React.ForwardRefRenderFunction<
        SVGSVGElement,
        React.SVGAttributes<SVGSVGElement>
    >;
    export default ReactComponent;
}
```

## LICENCE

MIT
