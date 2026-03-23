const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// --- CONFIGURATION SWAGGER COMPLÈTE (MISE À JOUR) ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Mon Blog API (INF222)',
            version: '1.0.0',
            description: 'API pour la gestion des articles de blog',
        },
        servers: [{ url: 'http://localhost:3000' }],
        paths: {
            "/api/articles": {
                "get": {
                    "summary": "Récupérer tous les articles",
                    "responses": { "200": { "description": "Succès" } }
                },
                "post": {
                    "summary": "Créer un article",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "titre": { "type": "string" },
                                        "contenu": { "type": "string" },
                                        "auteur": { "type": "string" },
                                        "categorie": { "type": "string" }
                                    }
                                }
                            }
                        }
                    },
                    "responses": { "201": { "description": "Créé" } }
                }
            },
            "/api/articles/search": {
                "get": {
                    "summary": "Rechercher un article par mot-clé",
                    "parameters": [{ "name": "query", "in": "query", "required": true, "schema": { "type": "string" } }],
                    "responses": { "200": { "description": "Succès" } }
                }
            },
            "/api/articles/{id}": {
                "get": {
                    "summary": "Récupérer un article par ID",
                    "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
                    "responses": { "200": { "description": "Succès" }, "404": { "description": "Non trouvé" } }
                },
                "put": {
                    "summary": "Modifier un article",
                    "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "titre": { "type": "string" },
                                        "contenu": { "type": "string" },
                                        "auteur": { "type": "string" },
                                        "categorie": { "type": "string" }
                                    }
                                }
                            }
                        }
                    },
                    "responses": { "200": { "description": "Mis à jour" } }
                },
                "delete": {
                    "summary": "Supprimer un article",
                    "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
                    "responses": { "200": { "description": "Supprimé" } }
                }
            }
        }
    },
    apis: [], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let db;

(async () => {
    db = await open({ filename: './blog.db', driver: sqlite3.Database });
    
    await db.exec(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        titre TEXT, contenu TEXT, auteur TEXT, date TEXT, categorie TEXT
    )`);

    // ROUTES
    app.get('/api/articles', async (req, res) => {
        const articles = await db.all('SELECT * FROM articles');
        res.json(articles);
    });

    app.post('/api/articles', async (req, res) => {
        const { titre, contenu, auteur, categorie } = req.body;
        if (!titre || !auteur) return res.status(400).json({ error: "Titre et auteur requis" });
        const date = new Date().toISOString().split('T')[0];
        const result = await db.run(
            `INSERT INTO articles (titre, contenu, auteur, date, categorie) VALUES (?, ?, ?, ?, ?)`, 
            [titre, contenu, auteur, date, categorie]
        );
        res.status(201).json({ id: result.lastID, message: "Article créé !" });
    });

    app.get('/api/articles/search', async (req, res) => {
        const { query } = req.query;
        const articles = await db.all(
            "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?", 
            [`%${query}%`, `%${query}%`]
        );
        res.json(articles);
    });

    app.get('/api/articles/:id', async (req, res) => {
        const article = await db.get("SELECT * FROM articles WHERE id = ?", [req.params.id]);
        article ? res.json(article) : res.status(404).json({ error: "Non trouvé" });
    });

    app.put('/api/articles/:id', async (req, res) => {
        const { titre, contenu, auteur, categorie } = req.body;
        const result = await db.run(
            "UPDATE articles SET titre = ?, contenu = ?, auteur = ?, categorie = ? WHERE id = ?",
            [titre, contenu, auteur, categorie, req.params.id]
        );
        result.changes > 0 ? res.json({ message: "Article mis à jour" }) : res.status(404).json({ error: "Non trouvé" });
    });

    app.delete('/api/articles/:id', async (req, res) => {
        await db.run("DELETE FROM articles WHERE id = ?", [req.params.id]);
        res.json({ message: "Article supprimé" });
    });

    app.listen(3000, () => {
        console.log("-----------------------------------------");
        console.log("Serveur lancé : http://localhost:3000");
        console.log("Swagger dispo : http://localhost:3000/api-docs");
        console.log("-----------------------------------------");
    });
})();