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
// https://jira.sonarsource.com/browse/RSPEC-4782
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ["sonar-runtime"],
            },
        ],
    },
    create(context) {
        if (!isRequiredParserServices_1.isRequiredParserServices(context.parserServices)) {
            return {};
        }
        function checkProperty(node) {
            const tsNode = node;
            const optionalToken = context
                .getSourceCode()
                .getFirstToken(node, token => token.value === "?");
            if (!tsNode.optional || !optionalToken) {
                return;
            }
            const typeNode = getUndefinedTypeAnnotation(tsNode.typeAnnotation);
            if (typeNode) {
                const secondaryLocations = [typeNode];
                const message = utils_1.toEncodedMessage("Consider removing 'undefined' type or '?' specifier, one of them is redundant.", secondaryLocations);
                context.report({
                    message,
                    loc: optionalToken.loc,
                });
            }
        }
        return {
            "ClassProperty, TSPropertySignature": (node) => checkProperty(node),
        };
    },
};
function getUndefinedTypeAnnotation(tsTypeAnnotation) {
    if (tsTypeAnnotation) {
        return getUndefinedTypeNode(tsTypeAnnotation.typeAnnotation);
    }
    return undefined;
}
function getUndefinedTypeNode(typeNode) {
    if (typeNode.type === "TSUndefinedKeyword") {
        return typeNode;
    }
    else if (typeNode.type === "TSUnionType") {
        return typeNode.types.find(innerTypeNode => getUndefinedTypeNode(innerTypeNode));
    }
    else if (typeNode.type === "TSParenthesizedType") {
        return getUndefinedTypeNode(typeNode.typeAnnotation);
    }
    return undefined;
}
//# sourceMappingURL=no-redundant-optional.js.map