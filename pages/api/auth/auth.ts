import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { users } from '../../../data/users'  // Import your mock users

const SECRET = process.env.JWT_SECRET || 'your-secure-secret'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { identifier, password } = req.body // identifier can be username or email

    // Find user by username OR email
    const user = users.find(
      (u) => u.username === identifier || u.email === identifier
    )

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' })
    }

    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username/email or password' })
    }

    // Create JWT with user info
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: '1h' }
    )

    // Set JWT in HttpOnly cookie
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
        sameSite: 'lax',
      })
    )

    return res.status(200).json({ message: 'Logged in', user: { id: user.id, username: user.username } })
  }

  if (req.method === 'DELETE') {
    // Clear cookie on logout
    res.setHeader(
      'Set-Cookie',
      serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
        sameSite: 'lax',
      })
    )
    return res.status(200).json({ message: 'Logged out' })
  }

  res.setHeader('Allow', ['POST', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
