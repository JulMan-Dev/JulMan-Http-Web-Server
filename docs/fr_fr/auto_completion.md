Le serveur complète automatiquement les `Server Scripts File Widget` trouvés (vous pouvez désactiver ce fonctionnalité dans la configuration du serveur).

Pour que le serveur les détecte, il faut mettre des balises.

Exemple avec un fichier HTML

```html
<p>Port : @{{ server.port }}</p>
```

Dans le navigateur, il y aura affiché par exemple

```txt
Port : 3000
```
