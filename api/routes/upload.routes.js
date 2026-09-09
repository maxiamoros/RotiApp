const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el .env');
}

// Use memory storage for Serverless
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'));
    }
  }
});

// Middleware for handling multer errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Error al subir archivo: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/', handleUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase no está configurado en el servidor' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `producto-${uniqueSuffix}${ext}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('productos-imagenes')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return res.status(500).json({ error: 'Error al guardar imagen en el bucket' });
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('productos-imagenes')
      .getPublicUrl(filename);

    const imageUrl = publicUrlData.publicUrl;
    
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la imagen' });
  }
});

module.exports = router;
