import * as fs from 'fs';

export type PluginInfos = {
    name: string,
    scripts: string[]
}

export class Plugin {
    private pluginInfos: PluginInfos;

    constructor (pluginInformations: PluginInfos) {
        this.pluginInfos = pluginInformations;

        this.checkScripts();
    }

    checkScripts(): string[] {
        if (fs.existsSync(`./plugins/${this.pluginInfos.name}`)) {
            this.pluginInfos.scripts.forEach((script) => {
                if (!fs.existsSync(`./plugins/${this.pluginInfos.name}/${script}`)) {
                    throw `PluginScriptMissing: The script "${script}" for "${this.pluginInfos.name} missing`;
                }
                console.log(`Found plugin script "./plugins/${this.pluginInfos.name}/${script}" !`);
            });

            return this.pluginInfos.scripts.map((v) => `./plugins/${v}`);
        } else {
            throw `PluginDirMissing: The plugin directory for "${this.pluginInfos.name}" missing`;
        }
    }

    execScript(script: string): unknown {
        return new Function(script).call(undefined);
    }
}