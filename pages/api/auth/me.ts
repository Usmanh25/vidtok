import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { client } from '../../../utils/client';

const SECRET = process.env.JWT_SECRET || 'your-secure-secret';

// Include image in the GROQ query
const getUserQuery = `*[_type == "user" && _id == $id][0]{
  _id,
  username,
  email,
  image
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token found' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const user = await client.fetch(getUserQuery, { id: decoded.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json({ user });
  } catch (error) {
    console.error('me.ts error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
