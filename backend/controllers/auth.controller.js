import axios from 'axios'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../prisma/client.js'
import jwt from 'jsonwebtoken'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * STEP 1: Redirect to Google with CSRF state
 */
export const googleAuth = (req, res) => {
  console.log('inside googleAuth =======================================')
  const state = crypto.randomBytes(16).toString('hex')

    res.cookie('oauthState', state, {
      httpOnly: true,
      secure: true,           // always true on Render (HTTPS)
      sameSite: 'lax',        // safe for OAuth redirects
      maxAge: 10 * 60 * 1000, // 10 minutes
      signed: true,           // prevent tampering
    })

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state, // important
  })

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}

/**
 * STEP 2: Google callback
 */
export const googleCallback = async (req, res) => {
  console.log("inside googleCallback =======================================")
  try {
    const { code, state } = req.query

    if (!code || !state) {
      return res.redirect(`${process.env.CLIENT_URL}/login`)
    }

    // Verify CSRF state
    const storedState = req.signedCookies.oauthState
      if (!storedState || state !== storedState) {
        console.error('OAuth state mismatch or missing')
        return res.redirect(`${process.env.CLIENT_URL}/login`)
    }

    // Clear the cookie
    res.clearCookie('oauthState', { signed: true })

    /**
     * Exchange authorization code for tokens
     */
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const { id_token } = tokenRes.data

    /**
     * Verify ID token (IMPORTANT)
     */
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload.email_verified) {
      console.error("Email not verified")
      return res.redirect(`${process.env.CLIENT_URL}/login`)
    }

    const email = payload.email
    const name = payload.name

    if (!email) {
      console.error("Email does not exists")
      return res.redirect(`${process.env.CLIENT_URL}/login`)
    }

    /**
     * Find or create user
     */
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          authProvider: 'google',
          name,
        },
      })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    res.redirect(`${process.env.CLIENT_URL}/oauth/callback#token=${token}`);
    
  } catch (err) {
    console.error('Google OAuth Error:', err)
    res.redirect(`${process.env.CLIENT_URL}/login`)
  }
}

/**
 * Get current logged-in user
 */
export const getMe = async (req, res) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        streakCount: true,
        totalPoints: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data:user,
    });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get the user' });
  }
}


