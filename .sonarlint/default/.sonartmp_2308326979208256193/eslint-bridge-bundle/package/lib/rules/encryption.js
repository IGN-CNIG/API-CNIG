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
// https://jira.sonarsource.com/browse/RSPEC-4787
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.getEncryptionRuleModule = (clientSideMethods, serverSideMethods, message) => ({
    create(context) {
        // for client side
        let usingCryptoInFile = false;
        return {
            Program() {
                // init flag for each file
                usingCryptoInFile = false;
            },
            MemberExpression(node) {
                // detect 'SubtleCrypto' object
                // which can be retrieved by 'crypto.subtle' or 'window.crypto.subtle'
                const { object, property } = node;
                if (utils_1.isIdentifier(property, "subtle") &&
                    (utils_1.isIdentifier(object, "crypto") || utils_1.isMemberWithProperty(object, "crypto"))) {
                    usingCryptoInFile = true;
                }
            },
            "CallExpression:exit"(node) {
                const { callee } = node;
                if (usingCryptoInFile) {
                    // e.g.: crypto.subtle.encrypt()
                    checkForClientSide(callee, context, clientSideMethods, message);
                }
                // e.g.
                // const crypto = require("crypto");
                // const cipher = crypto.createCipher(alg, key);
                checkForServerSide(callee, context, serverSideMethods, message);
            },
        };
    },
});
function checkForServerSide(callee, context, serverSideMethods, message) {
    let moduleName;
    if (callee.type === "MemberExpression" &&
        utils_1.isMemberWithProperty(callee, ...serverSideMethods) &&
        callee.object.type === "Identifier") {
        moduleName = utils_1.getModuleNameOfIdentifier(callee.object, context);
    }
    else if (utils_1.isIdentifier(callee, ...serverSideMethods)) {
        moduleName = utils_1.getModuleNameOfImportedIdentifier(callee, context);
    }
    if (moduleName && moduleName.value === "crypto") {
        context.report({
            message,
            node: callee,
        });
    }
}
function checkForClientSide(callee, context, clientSideMethods, message) {
    if (utils_1.isIdentifier(callee, ...clientSideMethods) ||
        utils_1.isMemberWithProperty(callee, ...clientSideMethods)) {
        context.report({
            message,
            node: callee,
        });
    }
}
const message = `Make sure that encrypting data is safe here.`;
const clientSideEncryptMethods = ["encrypt", "decrypt"];
const serverSideEncryptMethods = [
    "createCipher",
    "createCipheriv",
    "createDecipher",
    "createDecipheriv",
    "publicEncrypt",
    "publicDecrypt",
    "privateEncrypt",
    "privateDecrypt",
];
exports.rule = exports.getEncryptionRuleModule(clientSideEncryptMethods, serverSideEncryptMethods, message);
//# sourceMappingURL=encryption.js.map