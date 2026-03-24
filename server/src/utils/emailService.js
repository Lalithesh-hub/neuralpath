// src/utils/emailService.js
// Nodemailer email sender using Gmail SMTP.
// Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env
// If not set, email sending is silently skipped (no crash).

import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
  return transporter
}

// ─── BRANDED EMAIL TEMPLATE ────────────────────────────────────────────────────
function welcomeTemplate(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to NeuralPath</title>
</head>
<body style="margin:0;padding:0;background:#050914;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050914;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0f1a;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

        <!-- Top gradient bar -->
        <tr><td style="height:5px;background:linear-gradient(90deg,#00d4ff,#7c3aed,#06ffa5);"></td></tr>

        <!-- Header -->
        <tr><td style="padding:40px 48px 24px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:10px;height:10px;border-radius:50%;background:#06ffa5;vertical-align:middle;"></td>
              <td style="padding-left:8px;font-size:22px;font-weight:800;color:#00d4ff;font-family:'Segoe UI',Arial,sans-serif;">NeuralPath</td>
            </tr>
          </table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:0 48px 32px;">
          <h1 style="margin:0 0 12px;font-size:32px;font-weight:800;color:#ffffff;line-height:1.2;">
            Welcome aboard, ${name}! 🚀
          </h1>
          <p style="margin:0;font-size:16px;color:#6b7a99;line-height:1.7;">
            Your NeuralPath account is ready. You're now part of a community of 10,000+ learners mastering AI, full-stack development, and tech careers.
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

        <!-- What's next -->
        <tr><td style="padding:32px 48px;">
          <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#3d4f6b;letter-spacing:0.1em;text-transform:uppercase;">What you can do now</p>
          <table cellpadding="0" cellspacing="0" width="100%">
            ${[
              ['🤖', 'Chat with Nura', 'Ask our AI advisor anything about courses and career paths'],
              ['🗺️', 'Map Your Roadmap', 'Use the AI Career Architect to generate your personal 5-step plan'],
              ['⚔️', 'Enter the Arena', 'Practice live coding interviews with an AI senior engineer'],
              ['📚', 'Browse Courses', 'Find the perfect offline class and reserve your seat'],
            ].map(([ic, title, desc]) => `
            <tr>
              <td style="padding:12px 0;vertical-align:top;width:44px;">
                <div style="width:40px;height:40px;border-radius:10px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.15);text-align:center;line-height:40px;font-size:18px;">${ic}</div>
              </td>
              <td style="padding:12px 0 12px 16px;vertical-align:top;">
                <div style="font-weight:700;color:#e2e8f0;font-size:15px;margin-bottom:3px;">${title}</div>
                <div style="color:#4b5d7a;font-size:13px;line-height:1.5;">${desc}</div>
              </td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- CTA Button -->
        <tr><td style="padding:0 48px 40px;text-align:center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard"
            style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#00d4ff,#7c3aed);color:#fff;font-size:16px;font-weight:800;text-decoration:none;border-radius:12px;font-family:'Segoe UI',Arial,sans-serif;">
            Start Learning →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <p style="margin:0;font-size:12px;color:#2d3748;">
            NeuralPath — AI-Powered Computer Learning Centre<br/>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color:#00d4ff;text-decoration:none;">neuralpath.in</a>
            &nbsp;·&nbsp; You received this because you created an account.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── PUBLIC API ────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(user) {
  const t = getTransporter()
  if (!t) {
    console.log('[email] No Gmail config — skipping welcome email. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env to enable.')
    return
  }
  try {
    await t.sendMail({
      from: `"NeuralPath" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `Welcome to NeuralPath, ${user.name.split(' ')[0]}! 🚀`,
      html: welcomeTemplate(user.name),
    })
    console.log(`[email] Welcome email sent to ${user.email}`)
  } catch (err) {
    // Non-fatal — never crash registration due to email failure
    console.error('[email] Failed to send welcome email:', err.message)
  }
}
