

## PROBLEMATIQUE

L'application web comporte des erreurs sur le parcours employé qui doivent être analysées et déboguées.

## BESOIN
Afin d'avoir un parcours employé fiable il faut réaliser des tests unitaires et d'integration et débugger.

## Livrables
 Correction des erreurs détectées sur les parcours Employé et Administrateur
 Tests unitaires
 Tests d'intégration 
 Tests fonctionnels : plan de tests End-to-End du parcours employé



**Comment lancer l'application en local** :

Clonez le projet :
```
$ git clone https://github.com/flaaroussi/billed
```

Allez au repo cloné :
```
$ cd FaizaLaaroussi_9_25102021
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


**Comment lancer tous les tests en local avec Jest :**

```
$ npm run test
```

**Comment lancer un seul test :**

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

**Comment voir la couverture de test :**

`http://127.0.0.1:8080/coverage/lcov-report/`


