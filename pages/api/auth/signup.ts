import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { client } from '../../../utils/client'
import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secure-secret'

const checkUserExistsQuery = `*[_type == "user" && (username == $username || email == $email)][0]{ _id }`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' })
  }

  try {
    // Ensure lowercase for consistent querying
    const normalizedUsername = username.trim().toLowerCase()
    const normalizedEmail = email.trim().toLowerCase()

    // Check for existing user
    const existingUser = await client.fetch(checkUserExistsQuery, {
      username: normalizedUsername,
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already in use' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create Sanity user document
    const newUserDoc = {
      _type: 'user',
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    const createdUser = await client.create(newUserDoc)

    // Sign JWT token
    const token = jwt.sign(
      { id: createdUser._id, username: createdUser.username },
      SECRET,
      { expiresIn: '1h' }
    )

    // Set cookie
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

    // Send back minimal safe user data
    return res.status(201).json({
      message: 'User created',
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email, // Optional if needed
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
