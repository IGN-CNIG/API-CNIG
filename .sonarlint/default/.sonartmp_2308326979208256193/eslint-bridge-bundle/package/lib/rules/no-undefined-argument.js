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
// https://jira.sonarsource.com/browse/RSPEC-4623
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
let ts;
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            ts = require("typescript");
            return {
                CallExpression: (node) => {
                    const call = node;
                    const { arguments: args } = call;
                    if (args.length === 0) {
                        return;
                    }
                    const lastArgument = args[args.length - 1];
                    if (isUndefined(lastArgument) && isOptionalParameter(args.length - 1, call, services)) {
                        context.report({
                            message: `Remove this redundant "undefined".`,
                            node: lastArgument,
                        });
                    }
                },
            };
        }
        return {};
    },
};
function isUndefined(node) {
    return node.type === "Identifier" && node.name === "undefined";
}
function isOptionalParameter(paramIndex, node, services) {
    const signature = services.program
        .getTypeChecker()
        .getResolvedSignature(services.esTreeNodeToTSNodeMap.get(node));
    if (signature) {
        const declaration = signature.declaration;
        if (declaration && isFunctionLikeDeclaration(declaration)) {
            const { parameters } = declaration;
            const parameter = parameters[paramIndex];
            return parameter && (parameter.initializer || parameter.questionToken);
        }
    }
    return false;
}
function isFunctionLikeDeclaration(declaration) {
    return [
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.FunctionExpression,
        ts.SyntaxKind.ArrowFunction,
        ts.SyntaxKind.MethodDeclaration,
        ts.SyntaxKind.Constructor,
        ts.SyntaxKind.GetAccessor,
        ts.SyntaxKind.SetAccessor,
    ].includes(declaration.kind);
}
//# sourceMappingURL=no-undefined-argument.js.map