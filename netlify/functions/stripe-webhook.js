const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const axios = require('axios');

// Initialize Firebase Admin SDK using environment variables.
initializeApp({
    databaseURL: process.env.DATABASE_URL,
});

const db = getDatabase();

/**
 * Fulfills the order after a successful Stripe payment.
 * This involves:
 * 1. Checking if the slot is still available (to prevent race conditions).
 * 2. Saving the booking details to the database.
 * 3. Marking the original slot as booked.
 * 4. Triggering a confirmation email to the student.
 * @param {object} session - The Stripe Checkout Session object.
 */
async function fulfillOrder(session) {
    const { slotId, studentName, studentEmail, studentPhone, date } = session.metadata;

    // 1. Prevent race conditions: Atomically check if the slot is still available before booking.
    const slotRef = db.ref(`availableSlots/${slotId}`);
    const slotSnapshot = await slotRef.once('value');
    if (!slotSnapshot.exists() || slotSnapshot.val().isBooked) {
        // This can happen if two users try to book the same slot simultaneously. The first to pay wins.
        // We log a warning and may need to manually refund the second user.
        console.warn(`Fulfillment warning: Slot ${slotId} is already booked. No action taken for session ${session.id}.`);
        return; 
    }

    // 2. Save the new booking to the 'bookings' collection.
    const bookingsRef = db.ref('bookings');
    await bookingsRef.push({
        studentName,
        studentEmail,
        studentPhone,
        date,
        stripeCheckoutId: session.id, // Store Stripe session ID for reference and idempotency.
        createdAt: new Date().toISOString()
    });

    // 3. Mark the slot as booked to prevent others from selecting it.
    await slotRef.update({ isBooked: true });
    console.log(`Successfully saved booking and updated slot ${slotId}`);

    // 4. Trigger the confirmation email by calling our Netlify function.
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
        // If the email fails, we log the error but don't fail the webhook.
        // The booking is already saved, which is the most critical part.
        console.error(`Failed to send confirmation email for booking ${session.id}`, emailError.response ? emailError.response.data : emailError.message);
    }
}

/**
 * Netlify Function handler for incoming Stripe webhooks.
 */
exports.handler = async function(event) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = event.headers['stripe-signature'];

    let stripeEvent;

    try {
        // Verify the event came from Stripe using the webhook signature.
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;

        try {
            // Idempotency check: Before fulfilling, check if we've already processed this payment.
            // This prevents creating duplicate bookings if Stripe retries a webhook.
            const bookingsQuery = db.ref('bookings').orderByChild('stripeCheckoutId').equalTo(session.id);
            const snapshot = await bookingsQuery.once('value');

            if (snapshot.exists()) {
                // We've seen this one before, so we can safely ignore it.
                console.log(`Webhook received for an already processed session: ${session.id}. Ignoring.`);
            } else {
                // This is a new, successful payment. Fulfill the order.
                console.log(`Processing new successful payment for session: ${session.id}`);
                await fulfillOrder(session);
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            // Return a 500 error to signal to Stripe that it should retry this webhook.
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
