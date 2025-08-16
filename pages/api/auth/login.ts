import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { client } from '../../../utils/client'

const SECRET = process.env.JWT_SECRET || 'your-secure-secret'

const findUserQuery = `
  *[_type == "user" && (username == $identifier || email == $identifier)][0] {
    _id,
    username,
    email,
    passwordHash
  }
`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { identifier, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Both identifier and password are required' })
  }

  try {
    const user = await client.fetch(findUserQuery, {
      identifier: identifier.toLowerCase(),
    })

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid username/email or password' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username/email or password' })
    }

    // JWT payload can include more info if needed
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    }

    const token = jwt.sign(payload, SECRET, {
      expiresIn: '1h',
    })

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hour
        path: '/',
        sameSite: 'lax',
      })
    )

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}
