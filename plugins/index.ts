import * as fs from 'fs';

import { serverConfig } from '..';
import { Plugin } from './plugin.class';

export function loadModule(name: string): Plugin {
    let isBlacklist = false;
    serverConfig.pluginsOptions.backlistPluginsNames.forEach((blacklistItem) => {
        if (new RegExp(blacklistItem.replace(/\*/g, '[\\w\\_]*') + '.plugin.json', 'g').test(name)) isBlacklist = true;
    })

    if (!isBlacklist) {

        if (fs.existsSync(`./plugins/${name}${name.endsWith('.plugin.json') ? '' : '.plugin.json'}`)) {
            console.log(`Loading "./plugins/${name}${name.endsWith('.plugin.json') ? '' : '.plugin.json'}"...`);
            return new Plugin(
                JSON.parse(fs.readFileSync(`./plugins/${name}${name.endsWith('.plugin.json') ? '' : '.plugin.json'}`, { encoding: 'utf-8' }))
            );
        } else {
            throw `PluginNotFound: The requested plugin at "./plugins/${name}${name.endsWith('.plugin.json') ? '' : '.plugin.json'}" not found`;
        }

    } else throw 'PluginNameBlacklisted: The server configuration do not allow this plugin name';
}

export function loadAllModules(): Plugin[] {

    let foundPlugins: Plugin[] = [];

    fs.readdirSync('./plugins', 'utf-8').forEach((file) => {
        if (/[\w\_]*\.plugin\.json/.test(file)) {
            let isBlacklist = false;
            serverConfig.pluginsOptions.backlistPluginsNames.forEach((blacklistItem) => {
                if (new RegExp(blacklistItem.replace(/\*/g, '[\\w\\_]*') + '.plugin.json', 'g').test(file)) isBlacklist = true;
            })
            if (!isBlacklist) {
                foundPlugins.push(loadModule(file));
            } else {
                console.log(`Plugin name blacklisted ("${file}")`)
            }
        }
    })

    return foundPlugins;

}