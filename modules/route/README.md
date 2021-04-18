# Génération des routes

Base d'un fichier de route :
```JS
module.exports.meta = {
  title: '',
};

module.exports.routes = [];
```

Le tableau route contiendra toutes les déclarations de routes de vos applications. Avant chacune, il sera automatiquement exécuté une fonction permetant de vérifier le contenu du Body.

Tous les champs possibles sont :
