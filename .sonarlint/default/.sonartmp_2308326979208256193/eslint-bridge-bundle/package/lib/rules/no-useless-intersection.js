"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://jira.sonarsource.com/browse/RSPEC-4335
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            const ts = require("typescript");
            return {
                TSIntersectionType: (node) => {
                    const intersection = node;
                    const anyOrNever = intersection.types.find(typeNode => ["TSAnyKeyword", "TSNeverKeyword"].includes(typeNode.type));
                    if (anyOrNever) {
                        context.report({
                            message: `Simplify this intersection as it always has type "${anyOrNever.type === "TSAnyKeyword" ? "any" : "never"}".`,
                            node,
                        });
                    }
                    else {
                        intersection.types.forEach(typeNode => {
                            const tp = services.program
                                .getTypeChecker()
                                .getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(typeNode));
                            if (isTypeWithoutMembers(tp, ts)) {
                                context.report({
                                    message: "Remove this type without members or change this type intersection.",
                                    node: typeNode,
                                });
                            }
                        });
                    }
                },
            };
        }
        return {};
    },
};
function isTypeWithoutMembers(tp, ts) {
    return isNullLike(tp, ts) || (isEmptyInterface(tp) && isStandaloneInterface(tp.symbol, ts));
}
function isNullLike(tp, ts) {
    return (Boolean(tp.flags & ts.TypeFlags.Null) ||
        Boolean(tp.flags & ts.TypeFlags.Undefined) ||
        Boolean(tp.flags & ts.TypeFlags.Void));
}
function isEmptyInterface(tp) {
    return tp.symbol && tp.symbol.members && tp.symbol.members.size === 0;
}
function isStandaloneInterface({ declarations }, ts) {
    // there is no declarations for `{}`
    // otherwise check that none of declarations has a heritage clause (`extends X` or `implements X`)
    return (!declarations ||
        declarations.every(declaration => {
            return (isInterfaceDeclaration(declaration, ts) && (declaration.heritageClauses || []).length === 0);
        }));
}
function isInterfaceDeclaration(declaration, ts) {
    return declaration.kind === ts.SyntaxKind.InterfaceDeclaration;
}
//# sourceMappingURL=no-useless-intersection.js.map