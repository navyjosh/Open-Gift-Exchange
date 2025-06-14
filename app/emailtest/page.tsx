'use client'

import { useState } from 'react'

export default function EmailTestPage() {
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('Test Email from Wishlist App')
    const [body, setBody] = useState('Hello! This is a test email.')
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        setMessage('')

        try {
            const res = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to,
                    subject,
                    text: body,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send email')
            }

            setStatus('success')
            setMessage(`✅ Email sent to ${to}`)
        } catch (err: any) {
            setStatus('error')
            setMessage(err.message || 'Something went wrong.')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Test Email Sender</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Recipient Email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="Email body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                />
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {status === 'sending' ? 'Sending...' : 'Send Email'}
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
