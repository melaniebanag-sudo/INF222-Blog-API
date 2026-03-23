// On récupère la base de données (on l'importera plus tard)
exports.createArticle = async (db, req, res) => {
    try {
        const { titre, contenu, auteur, categorie, tags } = req.body;

        // Validation simple (Bonne pratique demandée dans le TP)
        if (!titre || !auteur) {
            return res.status(400).json({ error: "Le titre et l'auteur sont obligatoires" });
        }

        const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        const result = await db.run(
            `INSERT INTO articles (titre, contenu, auteur, date, categorie) VALUES (?, ?, ?, ?, ?)`,
            [titre, contenu, auteur, date, categorie]
        );

        res.status(201).json({ 
            id: result.lastID, 
            message: "Article créé avec succès !" 
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création" });
    }
};
