import * as estree from "estree";
import { SourceCode } from "eslint";
export default function visit(sourceCode: SourceCode, callback: (node: estree.Node) => void): void;
export declare function childrenOf(node: estree.Node, visitorKeys: SourceCode.VisitorKeys): estree.Node[];
