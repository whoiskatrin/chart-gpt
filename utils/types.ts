// utils/types.ts

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFills {
  type: string;
  visible: boolean;
  color: FigmaColor;
}

export interface FigmaStyle {
  fontFamily: string;
  fontPostScriptName: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx: number;
  lineHeightPercent: number;
  letterSpacing: number;
}

export interface FigmaChild {
  id: string;
  name: string;
  type: string;
  children?: FigmaChild[];
  characters?: string;
  style?: FigmaStyle;
  fills?: FigmaFills[];
  absoluteBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints: {
    vertical: string;
    horizontal: string;
  };
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
}

export interface FigmaFrame {
  style: any;
  fills: any;
  characters: any;
  id: string;
  name: string;
  type: string;
  children: FigmaChild[];
  backgroundColor: FigmaColor;
  absoluteBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints: {
    vertical: string;
    horizontal: string;
  };
}

export interface FigmaDocument {
  id: string;
  name: string;
  type: string;
  children: FigmaFrame[];
}
