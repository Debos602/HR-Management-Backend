import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueName + ext);
    },
});

// File filter
const fileFilter = (_req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            ),
            false
        );
    }
};

// Multer configuration
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxFileSize,
    },
});
