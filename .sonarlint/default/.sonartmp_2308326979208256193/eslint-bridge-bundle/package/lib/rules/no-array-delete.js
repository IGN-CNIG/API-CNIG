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
// https://jira.sonarsource.com/browse/RSPEC-2870
Object.defineProperty(exports, "__esModule", { value: true });
const isRequiredParserServices_1 = require("../utils/isRequiredParserServices");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const utils_1 = require("./utils");
const ArrayDeleteExpression = "UnaryExpression[operator='delete'] > MemberExpression[computed=true]";
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (isRequiredParserServices_1.isRequiredParserServices(services)) {
            return {
                [ArrayDeleteExpression]: (node) => {
                    const member = node;
                    const object = member.object;
                    if (utils_1.isArray(object, services)) {
                        raiseIssue(context);
                    }
                },
            };
        }
        return {};
    },
};
function raiseIssue(context) {
    const deleteKeyword = context.getSourceCode().getFirstToken(nodes_1.getParent(context));
    context.report({
        message: `Remove this use of "delete".`,
        loc: deleteKeyword.loc,
    });
}
//# sourceMappingURL=no-array-delete.js.map