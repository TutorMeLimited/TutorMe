const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const axios = require('axios');

initializeApp({
    databaseURL: process.env.DATABASE_URL,
});

const db = getDatabase();

async function fulfillOrder(session) {
    const { slotId, studentName, studentEmail, studentPhone, date } = session.metadata;

    const slotRef = db.ref(`availableSlots/${slotId}`);
    const slotSnapshot = await slotRef.once('value');
    if (!slotSnapshot.exists() || slotSnapshot.val().isBooked) {
        console.warn(`Fulfillment warning: Slot ${slotId} is already booked. No action taken for session ${session.id}.`);
        return; 
    }

    const bookingsRef = db.ref('bookings');
    await bookingsRef.push({
        studentName,
        studentEmail,
        studentPhone,
        date,
        stripeCheckoutId: session.id, 
        createdAt: new Date().toISOString()
    });

    await slotRef.update({ isBooked: true });
    console.log(`Successfully saved booking and updated slot ${slotId}`);

    const siteUrl = process.env.SITE_URL || 'http://localhost:8888';
    const emailFunctionUrl = `${siteUrl}/.netlify/functions/send-confirmation`;

    try {
        await axios.post(emailFunctionUrl, {
            studentName,
            studentEmail,
            bookedDate: date
        });
        console.log(`Successfully triggered confirmation email for ${studentEmail}`);
    } catch (emailError) {
        console.error(`Failed to send confirmation email for booking ${session.id}`, emailError.response ? emailError.response.data : emailError.message);
    }
}

exports.handler = async function(event) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = event.headers['stripe-signature'];

    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;

        try {
            const bookingsQuery = db.ref('bookings').orderByChild('stripeCheckoutId').equalTo(session.id);
            const snapshot = await bookingsQuery.once('value');

            if (snapshot.exists()) {
                console.log(`Webhook received for an already processed session: ${session.id}. Ignoring.`);
            } else {
                console.log(`Processing new successful payment for session: ${session.id}`);
                await fulfillOrder(session);
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Webhook handler failed.' })
            };
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ received: true }),
    };
};
