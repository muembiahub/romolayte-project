

# Romolayte

Romolayte est une plateforme de services et e-commerce construite avec **Node.js**, **Express**, **Supabase (PostgreSQL)** et **EJS**.  
Elle permet de gérer des catégories de services, des produits, et d’offrir une interface responsive et accessible.

---

## 🚀 Fonctionnalités
- Gestion des **catégories** (logo, nom, description, prix).
- Affichage dynamique des catégories et produits via **Express + EJS**.
- Base de données **PostgreSQL** hébergée sur Supabase.
- Design **responsive** et conforme aux standards d’accessibilité.
- Authentification et notifications prévues avec **Firebase**.

---

## 📂 Structure du projet
romolayte/
│
├── README.md              # Documentation du projet
├── package.json           # Dépendances Node.js
├── .gitignore             # Fichiers ignorés par Git
├── .env.example           # Exemple de configuration
│
├── src/
│   ├── server.js          # Point d'entrée Express
│   ├── routes/            # Routes Express
│   │   ├── categories.js
│   │   └── products.js
│   ├── views/             # Templates EJS
│   │   ├── partials/
│   │   │   ├── footer.ejs
│   │   │   ├── header.ejs
│   │   ├── login.ejs
│   │   ├── categories.ejs
│   │   └── products.ejs
│   ├── public/            # Fichiers statiques (CSS, JS, images)
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   └── app.js
│   │   └── images/
│   └── db/
│       └── supabaseClient.js
│
└── docs/
└── schema.sql         # Schéma de la base de données
