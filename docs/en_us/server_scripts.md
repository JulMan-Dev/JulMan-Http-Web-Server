# `Server Scripts`

## Détection

For the server to detect `Server Scripts`, they must to ends with *`.server.js`* (Exemple : `exemple.server.js` will be indexed)

For the server to execute `Server Scripts`, you set in the server configuration file, **`executeServerScripts`** to `true` :
```yml
...
# Allow server scripts's execution, if false, display 404 page
executeServerScripts: true
...
```

You can also setting scripts possibilitys :
```yml
...
serverScriptsOptions:
  # Allow server scripts to read/write/delete files
  allowFilesystem: true # <- Put true or false to activate the file system
  # Allow server scripts to execute others scripts (allow "require()")
  allowOtherScriptsExecution: false # <- Put true or false to activate "require()" function
...
```

## Execution

Server execute server script with this built-in functions :

```ts
write(data: any): void /* Write on output stream */
req: import('http').IncomingMessage /* The request */
setHeader(headerName: string, value: string): void /* Change header value */
setResponseCode(responseCode: number): void /* Change response code */
requestData: string /* The request body */

// This options are adjustable in configuration
fs: typeof import('fs') /* The file system (enabled by default) */
require(id: string): any /* (disabled by default) */
```