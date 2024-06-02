import multer from 'multer';
import path from 'path';
//import sharp from 'sharp';
//import { fileURLToPath } from 'url';

// Récupérer le chemin du dossier actuel
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// Configuration de Multer pour enregistrer les fichiers téléchargés
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const destinationFolder = 
  file.fieldname === 'logo' ? 'uploads/logo/' :
  file.fieldname === 'image' ? 'uploads/products/' :
  'uploads/profiles/';
    cb(null, destinationFolder);
  },
  // Définir le nom du fichier téléchargé
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Extraire l'extension du fichier
/*     const resizedFilename = file.fieldname + '-' + uniqueSuffix + extension;
    const resizedFilePath = path.resolve(__dirname, 'uploads', resizedFilename);

    // Redimensionner et compresser l'image
    sharp(file.path)
      .resize(300, 300)
      .toFile(resizedFilePath, (err, info) => {
        if (err) {
          return cb(err);
        } */
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);

  }
});

const fileFilter = (req, file, cb) => {
  // Vérifier si le type de fichier est une image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed')); // Rejeter le téléchargement du fichier
  }
};

// Créer un middleware Multer avec la configuration définie
export const upload = multer({ storage , fileFilter });