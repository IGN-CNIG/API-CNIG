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
// https://jira.sonarsource.com/browse/RSPEC-2310
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
        function checkLoop(updateNode, extractCounters, loopBody) {
            const counters = [];
            extractCounters(updateNode, counters);
            counters.forEach(counter => checkCounter(counter, loopBody));
        }
        function checkCounter(counter, block) {
            const variable = utils_1.getVariableFromName(context, counter.name);
            if (!variable) {
                return;
            }
            variable.references.forEach(ref => {
                if (ref.isWrite() && isUsedInsideBody(ref.identifier, block)) {
                    context.report({
                        node: ref.identifier,
                        message: utils_1.toEncodedMessage(`Remove this assignment of "${counter.name}".`, [counter], ["Counter variable update"]),
                    });
                }
            });
        }
        return {
            "ForStatement > BlockStatement": (node) => {
                const forLoop = nodes_1.getParent(context);
                if (forLoop.update) {
                    checkLoop(forLoop.update, collectCountersFor, node);
                }
            },
            "ForInStatement > BlockStatement, ForOfStatement > BlockStatement": (node) => {
                const { left } = nodes_1.getParent(context);
                checkLoop(left, collectCountersForX, node);
            },
        };
    },
};
function collectCountersForX(updateExpression, counters) {
    if (updateExpression.type === "VariableDeclaration") {
        updateExpression.declarations.forEach(decl => collectCountersForX(decl.id, counters));
    }
    else {
        utils_1.resolveIdentifiers(updateExpression, true).forEach(id => counters.push(id));
    }
}
function collectCountersFor(updateExpression, counters) {
    let counter = undefined;
    if (updateExpression.type === "AssignmentExpression") {
        counter = updateExpression.left;
    }
    else if (updateExpression.type === "UpdateExpression") {
        counter = updateExpression.argument;
    }
    else if (updateExpression.type === "SequenceExpression") {
        updateExpression.expressions.forEach(e => collectCountersFor(e, counters));
    }
    if (counter && counter.type === "Identifier") {
        counters.push(counter);
    }
}
function isUsedInsideBody(id, loopBody) {
    const bodyRange = loopBody.range;
    return id.range && bodyRange && id.range[0] > bodyRange[0] && id.range[1] < bodyRange[1];
}
//# sourceMappingURL=updated-loop-counter.js.map