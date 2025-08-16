// pages/api/profile/image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { client } from '../../../utils/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Sanity query for a single user
const getUserQuery = `*[_type == "user" && _id == $id][0]{
  _id,
  username,
  email,
  image
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('[Formidable Error]', err);
      return res.status(500).json({ message: 'Failed to parse form data' });
    }

    const userId = fields.userId?.toString().trim();
    const uploadedFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!userId || !uploadedFile) {
      return res.status(400).json({ message: 'Missing required fields: userId or image file' });
    }

    const filePath = uploadedFile.filepath;
    if (!filePath) {
      return res.status(500).json({ message: 'File path not found in uploaded file object' });
    }

    try {
      // Upload to Sanity
      const imageData = await client.assets.upload(
        'image',
        fs.createReadStream(filePath),
        { filename: uploadedFile.originalFilename || 'profile-image' }
      );

      // Update user document
      await client
        .patch(userId)
        .set({
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: imageData._id },
          },
        })
        .commit();

      // Fetch updated user
      const updatedUser = await client.fetch(getUserQuery, { id: userId });

      return res.status(200).json({
        message: 'Image uploaded successfully',
        user: updatedUser,
      });

    } catch (uploadError) {
      console.error('[Sanity Upload Error]', uploadError);
      return res.status(500).json({ message: 'Image upload failed', error: uploadError });
    }
  });
}
