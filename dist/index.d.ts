/// <reference types="react" />
export interface ILayeredImageProps extends React.HTMLProps<HTMLDivElement> {
  layers: Array<string>
  aspectRatio?: number
  borderRadius?: React.CSSProperties["borderRadius"]
  transitionDuration?: number
  transitionTimingFunction?: React.CSSProperties["transitionTimingFunction"]
  lightColor?: React.CSSProperties["color"]
  lightOpacity?: React.CSSProperties["opacity"]
  shadowColor?: React.CSSProperties["color"]
  shadowOpacity?: React.CSSProperties["opacity"]
}
export declare const LayeredImage: React.FC<ILayeredImageProps>
