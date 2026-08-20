export type SExprAtom = string | number | boolean | null;

export interface SExprNode {
  tag: string;
  props: Record<string, any>;
  children: (SExprNode | SExprAtom)[];
}

export type SExprAST = SExprNode | SExprAtom;