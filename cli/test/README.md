# Documentation de test
Pour ajouter un test ici, il suffit d'ajouter un fichier .js dans le dossier `test`.  
Ce fichier doit exporter un objet contenant deux propriétées :
```JS
module.exports = {
  description: '',
  test: async (test) => {},
};
```
- `description`: La description du test qui sera exécuté
- `test`: Fonction asynchrone executant la série de tests
La fonction `test` reçoit en argument une instance de TesterObj unique au test en question.

Pour lancer un test vous pouvez utilier la commande `npm run test [arg]`
- Si arg n'est pas mis, affiche la liste de tous les tests disponibles
- Si arg est égale au nom d'un test, lance ce test
- Si arg est égale à **all** execute tous les tests à la suite les un des autres

## TesterObj
- `assertEquals(val1, val2, description)` : Vérifie que `val1 === val2`
- `assertTrue(val, description)` : Vérifie que `val` est vraie
- `assertFalse(val, description)` : Vérifie que `val` est fausse

`description` est la description du test en question, affichée lors du test, optionnel