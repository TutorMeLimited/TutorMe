const Stripe = require('stripe');

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

function getSiteUrl(event) {
    const configuredUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
    const requestOrigin = event.headers.origin || event.headers.Origin;

    return (configuredUrl || requestOrigin || 'http://localhost:8889').replace(/\/$/, '');
}

function getRequiredString(value, fieldName) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`${fieldName} is required.`);
    }

    return value.trim();
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method Not Allowed' });
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
        console.error('Stripe checkout environment variables are not configured.');
        return jsonResponse(500, { error: 'Payment system is not configured.' });
    }

    let booking;

    try {
        booking = JSON.parse(event.body || '{}');
    } catch {
        return jsonResponse(400, { error: 'Request body must be valid JSON.' });
    }

    try {
        const slotId = getRequiredString(booking.slotId, 'slotId');
        const studentName = getRequiredString(booking.studentName, 'studentName');
        const studentEmail = getRequiredString(booking.studentEmail, 'studentEmail');
        const studentPhone = getRequiredString(booking.studentPhone, 'studentPhone');
        const date = getRequiredString(booking.date, 'date');
        const formattedDate = getRequiredString(booking.formattedDate, 'formattedDate');
        const siteUrl = getSiteUrl(event);
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: studentEmail,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            metadata: {
                slotId: slotId.slice(0, 500),
                studentName: studentName.slice(0, 500),
                studentEmail: studentEmail.slice(0, 500),
                studentPhone: studentPhone.slice(0, 500),
                date: date.slice(0, 500),
                formattedDate: formattedDate.slice(0, 500)
            },
            success_url: `${siteUrl}/book.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/book.html?slotId=${encodeURIComponent(slotId)}&payment=cancelled`
        });

        return jsonResponse(200, { sessionId: session.id });
    } catch (error) {
        if (error.message && error.message.endsWith(' is required.')) {
            return jsonResponse(400, { error: error.message });
        }

        console.error('Failed to create Stripe Checkout session:', error.message);
        return jsonResponse(500, { error: 'Could not create checkout session.' });
    }
};
