"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const fs = require("fs");
const path = require("path");
const parser_1 = require("./parser");
function getFilesForTsConfig(tsConfig) {
    let ts;
    try {
        ts = require("typescript");
    }
    catch (e) {
        return { error: e.message, errorCode: parser_1.ParseExceptionCode.MissingTypeScript };
    }
    const parseConfigHost = {
        fileExists: fs.existsSync,
        readDirectory: ts.sys.readDirectory,
        useCaseSensitiveFileNames: true,
    };
    const config = ts.readConfigFile(tsConfig, ts.sys.readFile);
    if (config.error !== undefined) {
        console.error(`Failed to parse tsconfig: ${tsConfig} (${config.error.messageText})`);
        return { error: config.error };
    }
    const parsed = ts.parseJsonConfigFileContent(config.config, parseConfigHost, path.resolve(path.dirname(tsConfig)), {
        noEmit: true,
    });
    return { files: parsed.fileNames };
}
exports.getFilesForTsConfig = getFilesForTsConfig;
//# sourceMappingURL=tsconfig.js.map