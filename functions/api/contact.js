// Cloudflare Pages Function: contact form handler.
// Verifies Turnstile server-side, then emails the inquiry via Resend.
// Env (Pages secrets): TURNSTILE_SECRET_KEY, RESEND_API_KEY

const CONTACT_TO = 'carhartconsulting@outlook.com';
// Resend free plan allows only one verified domain (pittsburghdivorces.com).
// This "from" is only ever seen by CONTACT_TO (self); replies go to the sender
// via reply_to below. To send from @rosscarhart.com, upgrade Resend and verify it.
const CONTACT_FROM = 'Ross Carhart Portfolio <portfolio@pittsburghdivorces.com>';

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}

export async function onRequestPost({ request, env }) {
    let data;
    try {
        data = await request.json();
    } catch {
        return json({ ok: false, error: 'Invalid request body' }, 400);
    }

    const name = String(data.name ?? '').trim();
    const email = String(data.email ?? '').trim();
    const company = String(data.company ?? '').trim();
    const need = String(data.need ?? '').trim();
    const message = String(data.message ?? '').trim();
    const token = String(data.turnstileToken ?? '');

    if (!name || name.length > 200) return json({ ok: false, error: 'Please provide your name' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return json({ ok: false, error: 'Please provide a valid email' }, 400);
    }
    if (!message || message.length > 5000) return json({ ok: false, error: 'Please include a message' }, 400);
    if (!token) return json({ ok: false, error: 'Please complete the security check' }, 400);

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            secret: env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: request.headers.get('CF-Connecting-IP'),
        }),
    });
    const outcome = await verify.json();
    if (!outcome.success) {
        return json({ ok: false, error: 'Security check failed — please try again' }, 403);
    }

    const html = `
        <h2>New portfolio inquiry</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Company:</strong> ${esc(company) || '—'}</p>
        <p><strong>Looking for:</strong> ${esc(need) || '—'}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(message).replace(/\n/g, '<br>')}</p>`;

    const sent = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: CONTACT_FROM,
            to: [CONTACT_TO],
            reply_to: email,
            subject: `Portfolio inquiry from ${name}`,
            html,
        }),
    });

    if (!sent.ok) {
        console.error('Resend error:', sent.status, await sent.text());
        return json({ ok: false, error: 'Could not send your message — please email me directly' }, 502);
    }

    return json({ ok: true });
}
