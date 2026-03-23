API de Blog Technique - INF222

Ce projet est une API REST développée dans le cadre de l'UE INF222 à l'Université de Yaoundé I. Elle permet de gérer des articles de blog (CRUD) et inclut une documentation interactive via Swagger.

Installation et Lancement
1. **Installer les dépendances** : `npm install`
2. **Lancer le serveur** : `node server.js`
   *Serveur accessible sur : `http://localhost:3000`*

Documentation de l'API
Documentation interactive Swagger UI : `http://localhost:3000/api-docs`

Endpoints Principaux
- **GET** `/api/articles` : Liste des articles.
- **POST** `/api/articles` : Créer un article.
- **GET** `/api/articles/search?query=mot-clé` : Rechercher un article.

 Exemple d'utilisation
{
  "titre": "Maîtriser Node.js",
  "contenu": "Cours complet sur le développement Backend.",
  "auteur": "Tom",
  "categorie": "Backend"
}
