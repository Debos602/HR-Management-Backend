import cloudinary from '../config/cloudinary';

export async function uploadToCloudinary(filePath: string, folder = 'employees') {
    const res = await cloudinary.uploader.upload(filePath, {
        folder,
        use_filename: true,
        unique_filename: false,
        resource_type: 'image',
    });
    return {
        url: res.secure_url,
        public_id: res.public_id,
    };
}

export async function deleteFromCloudinary(publicId: string) {
    return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
