const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const axios = require('axios');

// Initialize Firebase Admin SDK
// You must set GOOGLE_APPLICATION_CREDENTIALS as a JSON environment variable in Netlify
initializeApp();

const db = getDatabase();

/**
 * Fulfills the order by saving the booking, marking the slot as booked,
 * and triggering a confirmation email.
 * @param {object} session - The Stripe Checkout Session object.
 * @returns {Promise<void>}
 */
async function fulfillOrder(session) {
    const { slotId, studentName, studentEmail, studentPhone, date } = session.metadata;

    // 1. Check if the slot is still available to prevent race conditions.
    const slotRef = db.ref(`availableSlots/${slotId}`);
    const slotSnapshot = await slotRef.once('value');
    if (!slotSnapshot.exists() || slotSnapshot.val().isBooked) {
        // This can happen if two people try to book the same slot, or if the webhook is retried for an already fulfilled session.
        // The first one to complete payment gets it.
        console.warn(`Fulfillment warning: Slot ${slotId} is already booked. No action taken for session ${session.id}.`);
        // You might want to email yourself here to manually refund the second user.
        return; // Stop processing
    }

    // 2. Save the booking to the 'bookings' node
    const bookingsRef = db.ref('bookings');
    await bookingsRef.push({
        studentName,
        studentEmail,
        studentPhone,
        date,
        stripeCheckoutId: session.id, // Store Stripe session ID for reference
        createdAt: new Date().toISOString()
    });

    // 3. Mark the slot as booked
    await slotRef.update({ isBooked: true });
    console.log(`Successfully saved booking and updated slot ${slotId}`);

    // 4. Trigger the confirmation email
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
        // Log the error, but don't fail the webhook since the booking is already saved.
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

    // Handle the checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;

        try {
            // Idempotency check: See if we've already processed this payment.
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
            // Return a 500 to signal to Stripe that it should retry.
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
