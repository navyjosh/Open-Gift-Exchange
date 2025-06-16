// lib/email.ts
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

interface InviteEmailOptions {
    to: string
    inviterName: string
    exchangeName: string
    inviteLink: string
}

export async function sendInviteEmail({
    to,
    inviterName,
    exchangeName,
    inviteLink,
}: InviteEmailOptions) {
    const emailContent = `
TO: ${to}
SUBJECT: 🎁 You're invited to join ${exchangeName}!

${inviterName} has invited you to join the gift exchange "${exchangeName}".

Click here to accept your invite:
${inviteLink}

This invite may expire soon.
`

    const outputPath = path.join(process.cwd(), 'emails', `${Date.now()}_${to.replace(/[@.]/g, '_')}.txt`)

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, emailContent.trim())

    console.log(`Dummy invite email saved to: ${outputPath}`)
}

interface VerificationEmailOptions {
    to: string
    name?: string
    verifyUrl: string
    sendVerificationLink?: boolean
}

export async function sendWelcomeEmail({
    to,
    name,
    verifyUrl,
    sendVerificationLink = true,
}: VerificationEmailOptions) {
    const userName = name || to
    const linkBlock = sendVerificationLink
        ? `<p>Click the button below to verify your email address:</p>
           <a href="${verifyUrl}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
           ">Verify Email</a>`
        : `<p>Your account is ready. You can now join or create a gift exchange!</p>`

    await transporter.sendMail({
        to,
        from: '"Gift Exchange" <opengiftexchange@zohomail.com>',
        subject: 'Welcome to Gift Exchange!',
        html: `
            <h2>Hi ${userName}, welcome to Gift Exchange! 🎁</h2>
            ${linkBlock}
            <p>If you did not create an account, you can ignore this email.</p>
        `,
    })
}


