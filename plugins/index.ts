import * as fs from 'fs';

import { Plugin } from './plugin.class';

export function loadModule(name: string): Plugin {
    if (fs.existsSync(`./plugins/${name}.plugin.json`)) {
        return new Plugin(
            JSON.parse(fs.readFileSync(`./plugins/${name}.plugin.json`, { encoding: 'utf-8' }))
        );
    } else {
        throw `PluginNotFound: The requested plugin at "./plugins/${name}.plugin.json" not found`;
    }
}