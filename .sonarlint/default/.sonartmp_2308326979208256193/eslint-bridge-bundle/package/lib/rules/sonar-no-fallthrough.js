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
Object.defineProperty(exports, "__esModule", { value: true });
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
exports.rule = {
    create(context) {
        let currentCodePath = null;
        function noComment(node) {
            return context.getSourceCode().getCommentsAfter(node).length === 0;
        }
        return {
            onCodePathStart(codePath) {
                currentCodePath = codePath;
            },
            onCodePathEnd() {
                currentCodePath = currentCodePath.upper;
            },
            "SwitchCase:exit"(node) {
                const switchCase = node;
                const { cases } = nodes_1.getParent(context);
                if (currentCodePath.currentSegments.some(s => s.reachable) &&
                    switchCase.consequent.length > 0 &&
                    cases[cases.length - 1] !== node &&
                    noComment(switchCase)) {
                    context.report({
                        message: "End this switch case with an unconditional break, continue, return or throw statement.",
                        loc: context.getSourceCode().getFirstToken(node).loc,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=sonar-no-fallthrough.js.map