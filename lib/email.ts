// lib/email.ts
import fs from 'fs'
import path from 'path'

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
