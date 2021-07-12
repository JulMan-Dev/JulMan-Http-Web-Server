# `Server Scripts`

## Détection

Pour que le serveur détecte les `Server Scripts`, il doivent terminé par *`.server.js`* (Exemple : `exemple.server.js` va être intégré)

Pour que le serveur exécute `Server Scripts`, vous devez mettre dans la configuration du serveur, **`executeServerScripts`** sur `true` :
```yml
...
# Active l'exécution des Server Scripts, si false, affche la page 404
executeServerScripts: true
...
```

Vous pouvez aussi paramètrer les possibilités des scripts :
```yml
...
serverScriptsOptions:
  # Permet au scripts de lire/écrire/supprimer les fichiers
  allowFilesystem: true # <- Mettez true/false pour activer cette option
  # Permet au scripts de récupérer des choses d'autre scripts (active "require()")
  allowOtherScriptsExecution: false # <- Mettez true/false pour activer cette option
...
```

## Exécution

Le serveur exécute le script serveur assosié avec ces fonctions intégrés :

```ts
write(data: any): void /* Ecrit dans le flux de sortie */
req: import('http').IncomingMessage /* La requête */
setHeader(headerName: string, value: string): void /* Changer la valeur d'une en-tête */
setResponseCode(responseCode: number): void /* Change le code de réponse */
requestData: string /* Le corps de la requête */

// Ces options sont réglable dans la configuration
fs: typeof import('fs') /* Le système de fichier (activé par défaut) */
require(id: string): any /* (désactivé par défault) */
```