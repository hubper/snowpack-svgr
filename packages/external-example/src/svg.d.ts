declare module '*.svg' {
  export const ReactComponent: React.ForwardRefRenderFunction<
    SVGSVGElement,
    React.SVGAttributes<SVGSVGElement>
  >;
  const src: string;
  export default src;
}
