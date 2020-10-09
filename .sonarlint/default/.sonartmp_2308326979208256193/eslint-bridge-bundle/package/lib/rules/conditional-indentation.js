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
// https://jira.sonarsource.com/browse/RSPEC-3973
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
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
        const sourceCode = context.getSourceCode();
        return {
            IfStatement: (node) => {
                const ifStatement = node;
                const parent = nodes_1.getParent(context);
                if (parent && parent.type !== "IfStatement") {
                    const firstToken = sourceCode.getFirstToken(node);
                    checkIndentation(firstToken, ifStatement.consequent, context);
                }
                if (ifStatement.alternate) {
                    const elseToken = sourceCode.getTokenBefore(ifStatement.alternate, token => token.type === "Keyword" && token.value === "else");
                    const alternate = ifStatement.alternate;
                    if (alternate.type === "IfStatement") {
                        //case with "else if", we have to check the consequent of the next if
                        checkIndentation(elseToken, alternate.consequent, context);
                    }
                    else {
                        checkIndentation(elseToken, alternate, context);
                    }
                }
            },
            "WhileStatement, ForStatement, ForInStatement, ForOfStatement": (node) => {
                const firstToken = sourceCode.getFirstToken(node);
                checkIndentation(firstToken, node.body, context);
            },
        };
    },
};
function checkIndentation(firstToken, statement, context) {
    if (firstToken && statement.type !== "BlockStatement") {
        const firstStatementToken = context.getSourceCode().getFirstToken(statement);
        if (firstStatementToken &&
            firstToken.loc.start.column >= firstStatementToken.loc.start.column) {
            const message = `Use curly braces or indentation to denote the code conditionally executed by this "${firstToken.value}".`;
            context.report({
                message: utils_1.toEncodedMessage(message, [firstStatementToken]),
                loc: firstToken.loc,
            });
        }
    }
}
//# sourceMappingURL=conditional-indentation.js.map