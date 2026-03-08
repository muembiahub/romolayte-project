// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import slugify from 'slugify'; // npm install slugify

// import categoriesRouter from './routes/categories.js';
// import servicesRouter from './routes/services.js';
// import contactRoutes from './routes/contact.js';
// import supabase from './db/supabaseClient.js'; // ✅ client centralisé

// dotenv.config();

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configurer EJS comme moteur de templates
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"],
//       styleSrc: ["'self'", "https:", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "https://ofhmwjzxakhgbafywxwp.supabase.co"],
//       connectSrc: [
//         "'self'",
//         "https://ofhmwjzxakhgbafywxwp.supabase.co",
//         "https://nominatim.openstreetmap.org"
//       ],
//       fontSrc: ["'self'", "https:", "data:"],
//     },
//   })
// );

// // Fichiers statiques
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/categories', categoriesRouter);
// app.use('/services', servicesRouter);
// app.use('/', contactRoutes);


// app.get('/', (req, res) => {
//   const title = 'Accueil';
//   res.render('home', { title });
// });




// // Fonction de normalisation Unicode (supprime accents et caractères spéciaux)
// const normalize = (str) =>
//   str
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // supprime accents
//     .replace(/[’']/g, "")            // supprime apostrophes
//     .toLowerCase();

// async function syncImages() {
//   try {
//     // Liste des fichiers à la racine
//     const { data: rootFiles, error: errorRoot } = await supabase.storage
//       .from('services-images')
//       .list('', { limit: 1000 });

//     if (errorRoot) {
//       console.error("❌ Erreur racine:", errorRoot.message);
//       return;
//     }

//     const files = rootFiles || [];
//     console.log("📂 Fichiers trouvés:", files.map(f => f.name));

//     // Récupération des services
//     const { data: services, error: servicesError } = await supabase
//       .from('services')
//       .select('service_id, name');

//     if (servicesError) {
//       console.error('❌ Erreur récupération services:', servicesError.message);
//       return;
//     }

//     for (const service of services) {
//       let file = null;
//       let mode = '';
//       const testedVariants = [];

//       // Nom brut
//       const rawName = normalize(service.name);
//       testedVariants.push(rawName + ".webp");
//       file = files.find(f => normalize(f.name.replace('.webp','')) === rawName);
//       if (file) mode = `nom brut → ${file.name}`;

//       // Slugify
//       if (!file) {
//         const slugName = slugify(service.name, { lower: true, strict: true });
//         testedVariants.push(slugName + ".webp");
//         file = files.find(f => f.name.replace('.webp','') === slugName);
//         if (file) mode = `slugify → ${file.name}`;
//       }

//       // Underscore
//       if (!file) {
//         const underscoredName = normalize(service.name).replace(/\s+/g, '_');
//         testedVariants.push(underscoredName + ".webp");
//         file = files.find(f => f.name.replace('.webp','') === underscoredName);
//         if (file) mode = `underscore → ${file.name}`;
//       }

//       if (!file) {
//         console.warn(`⚠️ Aucun fichier trouvé pour "${service.name}"`);
//         console.log("   Variantes testées:", testedVariants.join(", "));
//         continue;
//       }

//       // Si on a trouvé un fichier
//       const { data } = supabase.storage
//         .from('services-images')
//         .getPublicUrl(file.name);

//       const { error: updateError } = await supabase
//         .from('services')
//         .update({ logo: data.publicUrl })
//         .eq('service_id', service.service_id);

//       if (updateError) {
//         console.error(`⚠️ Erreur update pour ${service.name}:`, updateError.message);
//       } else {
//         console.log(`✅ Service mis à jour (${mode}) : ${service.name} → ${data.publicUrl}`);
//       }
//     }

//     console.log("🎉 Synchronisation terminée !");
//   } catch (err) {
//     console.error("⚠️ Erreur syncImages:", err.message);
//   }
// }




// // Lancer le serveur
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Romolayte est lancé sur http://localhost:${PORT}`);
//   syncImages(); // synchroniser les images au démarrage
// });
