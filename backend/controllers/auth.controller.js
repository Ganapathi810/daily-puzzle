import axios from 'axios'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../prisma/client.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * STEP 1: Redirect to Google with CSRF state
 */
export const googleAuth = (req, res) => {
  console.log('inside googleAuth =======================================')
  const state = crypto.randomBytes(16).toString('hex')

  // Store state in session (CSRF protection)
  req.session.oauthState = state

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
    if (state !== req.session.oauthState) {
      return res.redirect(`${process.env.CLIENT_URL}/login`)
    }

    delete req.session.oauthState

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
    const givenName = payload.given_name
    const familyName = payload.family_name
    const picture = payload.picture
    console.log(name, givenName, familyName, picture)


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
        },
      })
    }


    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err)
        return res.redirect(`${process.env.CLIENT_URL}/login`)
      }
      console.log('New session ID after regenerate:', req.sessionID);
      req.session.userId = user.id
      console.log('Session full object data before save:', req.session)

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err)
          return res.redirect(`${process.env.CLIENT_URL}/login`)
        }

        console.log("User ID in session (after save) in regenerate:", req.session.userId)
        return res.redirect(`${process.env.CLIENT_URL}/`)
      })
    })
  } catch (err) {
    console.error('Google OAuth Error:', err)
    res.redirect(`${process.env.CLIENT_URL}/login`)
  }
}

/**
 * Get current logged-in user
 */
export const getMe = async (req, res) => {
  console.log("inside getMe ============================================")
  
  if (!req.session) {
    console.error("Session object is missing on request! Session middleware failure?");
    return res.status(500).json({ error: "Session unavailable" });
  }

  try {
    console.log("Session ID: in getme", req.sessionID);
    console.log("User ID in session: in get me", req.session.userId);
console.log('Full session object in getMe:', req.session);

    if (!req.session.userId) {
      console.log("No userId in session. Sending 401.");
      return res.status(401).json({
        error: "Session expired or invalid"
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        email: true,
        streakCount: true,
        totalPoints: true,
      },
    })

    if (!user) {
      console.log("User not found in DB but session exists. Destroying session.");
      req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
      })
      return res.status(401).json({ error: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error("Error in getMe:", err)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * Logout
 */
export const logout = (req, res) => {
  req.session.destroy(err => {
  if (err) return res.status(500).json({ error: "Logout failed" })
  res.clearCookie('dailypuzzle.sid', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  })
  res.sendStatus(200)
})
}
