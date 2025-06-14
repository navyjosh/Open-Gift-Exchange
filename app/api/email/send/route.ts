import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const { to, subject, text, html } = await req.json()

        if (!to || !subject || (!text && !html)) {
            return NextResponse.json({ error: 'Missing email parameters' }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Email send failed:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
