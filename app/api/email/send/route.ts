import { NextResponse } from 'next/server'
import { transporter } from '@/lib/email'


export async function POST(req: Request) {
    try {
        const { to, subject, text, html } = await req.json()

        if (!to || !subject || (!text && !html)) {
            return NextResponse.json({ error: 'Missing email parameters' }, { status: 400 })
        }
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Email send failed:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
