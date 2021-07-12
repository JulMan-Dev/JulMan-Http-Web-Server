import * as fs from 'fs';
import * as http from 'http';
import * as ws from 'ws';
import * as yaml from 'js-yaml';

import * as pluginLoader from './plugins';
import * as utils from './utils';

const fetch = require('node-fetch').default;

export const serverConfig: import('./types').ServerConfig = Object(yaml.load(fs.readFileSync('./config/server_config.yaml', 'utf-8')));

const AsyncFunction: new (...args: string[]) => (...args: any[]) => Promise<any> = Object.getPrototypeOf(async function () { }).constructor

let serverInfos = {
    port: process.argv.includes('--port') ? process.argv[process.argv.indexOf('--port') + 1] : serverConfig.httpOptions.port,
    hostname: '127.0.0.1',
}

serverConfig.pluginsOptions.loadPlugins ? pluginLoader.loadAllModules() : null;

const server = http.createServer(async (req, res) => {
    let req_ = (await import('url')).parse(req.url);

    let resCode: number = 404;
    let res_: string = `<h1>404 Not Found</h1><hr/><i>JulMan Http Web Server</i>`;
    let headers: {
        [header: string]: string
    } = {
        "Content-Type": "text/html; charset=utf-8"
    }

    if ((fs.existsSync(`./server${req_.path}`) && !utils.isDirectory(`./server${req_.path}`) && serverConfig.requireAbsulutePath) ||
        (!serverConfig.requireAbsulutePath && fs.existsSync(`./server${req_.path}${req_.path.endsWith('/') ? '' : '/'}index.html`)) ||
        (!serverConfig.requireAbsulutePath && (fs.existsSync(`./server${req_.path}.server.js`) && !utils.isDirectory(`./server${req_.path}.server.js`)))) {
        let file =
            (fs.existsSync(`./server${req_.path}`) && !utils.isDirectory(`./server${req_.path}`) && serverConfig.requireAbsulutePath) ? `./server${req_.path}` :
                fs.existsSync(`./server${req_.path}${req_.path.endsWith('/') ? '' : '/'}index.html`) && !serverConfig.requireAbsulutePath ?
                    `./server${req_.path}${req_.path.endsWith('/') ? '' : '/'}index.html` : `./server${req_.path}.server.js`;

        let request = '';
        if (req.readableLength) request = req.read(req.readableLength);

        try {
            if (file.endsWith('.server.js')) {
                if (serverConfig.executeServerScripts) {
                    resCode = 200;
                    res_ = "";

                    const serverJsArgs: {
                        argsName: string[],
                        argsValue: (((...args: any[]) => void) | object | string)[]
                    } = {
                        argsName: [
                            'write',
                            'req',
                            'setHeader',
                            'setResponseCode',
                            'setInterval',
                            'requestData',
                        ],
                        argsValue: [
                            (data: any) => {
                                res_ += String(typeof data == 'function' ? '[function Function]' : data);
                            },
                            req,
                            (headerName: string, value: string): void => {
                                headers[headerName] = value;
                            },
                            (responseCode: number): void => {
                                resCode = responseCode;
                            },
                            () => { },
                            request
                        ]
                    };

                    serverConfig.serverScriptsOptions.allowFilesystem ? (() => {
                        serverJsArgs.argsName.push('fs');
                        serverJsArgs.argsValue.push(fs);
                    })() : null;
                    serverConfig.serverScriptsOptions.allowOtherScriptsExecution ? (() => {
                        serverJsArgs.argsName.push('require');
                        serverJsArgs.argsValue.push(require);
                    })() : null;

                    try {
                        await new AsyncFunction(...serverJsArgs.argsName, fs.readFileSync(file, { encoding: 'utf-8' })).call(null, ...serverJsArgs.argsValue);
                    } catch (err) {
                        let str = `<h1>Internal Server Error</h1><p>An error occurred while executing script for render page</p><hr><code>Current error : ${err.toString()}</code><br/<br/><br/><i>JulMan Http Web Server</i>`;
                        res.writeHead(500, "Internal Server Error", {
                            'Content-Type': 'text/html; charset=utf-8',
                            'Content-Length': str.length,
                            'Server': 'JulMan Http Web Server'
                        });
                        res.write(str);
                    }
                }
            } else {
                resCode = 200;
                res_ = fs.readFileSync(file, { encoding: 'utf-8' })
                    .replace(/@{{\s*[\w\.\(\)\"\'\s\{\}]*\s*}}/gi, (match) => {
                        if (serverConfig.executeServerScriptsFileWidget) {
                            let match_: string = match.substr(3);
                            match_ = match_.substring(0, match_.length - 2)
                            try {
                                return String(new Function('server', 'req', 'return ' + match_).call(server, serverInfos, req));
                            } catch (err) {
                                let str = `<h1>Internal Server Error</h1><p>An error occurred while pre-filling the page</p><hr><code>Current error : ${err.toString()}</code><br/<br/><br/><i>JulMan Http Web Server</i>`;
                                res.writeHead(500, "Internal Server Error", {
                                    'Content-Type': 'text/html; charset=utf-8',
                                    'Content-Length': str.length,
                                    'Server': 'JulMan Http Web Server'
                                });
                                res.write(str);
                            }
                        } else return '?';
                    });
            }
        } catch { }
    }

    headers['Server'] = 'JulMan Http Web Server'
    headers['Content-Length'] = String(res_.length);
    res.writeHead(resCode, JSON.parse(fs.readFileSync('./json/responsesCodes.json', { encoding: 'utf-8' }))['' + resCode], headers);
    res.write(res_);
});

server.listen(serverInfos.port, () => {
    console.log(`Server ready on "localhost:${serverInfos.port}"`);
});

server.on('close', () => {
    console.log('Server closed');
})