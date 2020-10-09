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
// https://jira.sonarsource.com/browse/RSPEC-4621
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
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
        return {
            "TSUnionType, TSIntersectionType": function (node) {
                const sourceCode = context.getSourceCode();
                const compositeType = node;
                const groupedTypes = new Map();
                compositeType.types.forEach(typescriptType => {
                    const nodeValue = sourceCode.getText(typescriptType);
                    const nodesWithGivenType = groupedTypes.get(nodeValue);
                    const nodeType = typescriptType;
                    if (!nodesWithGivenType) {
                        groupedTypes.set(nodeValue, [nodeType]);
                    }
                    else {
                        nodesWithGivenType.push(nodeType);
                    }
                });
                groupedTypes.forEach(duplicates => {
                    if (duplicates.length > 1) {
                        const primaryNode = duplicates.splice(1, 1)[0];
                        const secondaryMessages = Array(duplicates.length);
                        secondaryMessages[0] = `Original`;
                        secondaryMessages.fill(`Another duplicate`, 1, duplicates.length);
                        context.report({
                            message: utils_1.toEncodedMessage(`Remove this duplicated type or replace with another one.`, duplicates, secondaryMessages),
                            loc: primaryNode.loc,
                        });
                    }
                });
            },
        };
    },
};
//# sourceMappingURL=no-duplicate-in-composite.js.map