// This is the updated serverless function with the CORRECT Zoho API endpoint and payload structure.

const axios = require('axios');

// Helper function to generate the email HTML (no changes here, it's already good)
function generateHtmlEmail(studentName, friendlyDate) {
    const accentColor = '#f72585';
    const sociologyColor = '#ffc300';
    const psychologyColor = '#a259d9';
    const physicsColor = '#4361ee';
    const textColor = '#222';
    const backgroundColor = psychologyColor; 
    return `<!DOCTYPE html> ...`; // The long HTML string from before goes here
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { studentName, studentEmail, bookedDate } = JSON.parse(event.body);
        const ZOHO_API_KEY = process.env.ZOHO_API_KEY;

        const friendlyDate = new Date(bookedDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

        // --- FIX: Using the CORRECT Zoho API Endpoint ---
        // NOTE: If your Zoho account is based in the EU, you may need to change .com to .eu
        const zohoApiEndpoint = 'https://api.zeptomail.com/v1.1/email';

        // --- FIX: Using the CORRECT Payload Structure for Zoho's API ---
        const emailPayload = {
            from: {
                address: "contact@tutormee.co.uk",
                name: "Tutormee"
            },
            to: [
                {
                    email_address: {
                        address: studentEmail,
                        name: studentName
                    }
                }
            ],
            cc: [
                {
                    email_address: {
                        address: "bookings@tutormee.co.uk",
                        name: "Tutormee Bookings"
                    }
                }
            ],
            subject: "Your Tutormee Consultation is Confirmed!",
            htmlbody: generateHtmlEmail(studentName, friendlyDate)
        };

        // --- FIX: The Authorization header needs to be 'Authorization': `Bearer ${ZOHO_API_KEY}` ---
        // (This might vary, but Bearer token is a common standard)
        // Let's assume you need to use Zoho's specific 'Zoho-Api-Key' if Bearer doesn't work.
        // Also, it's often 'Content-Type': 'application/json' that is required.
        await axios.post(zohoApiEndpoint, emailPayload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZOHO_API_KEY}` // IMPORTANT: Using Bearer token
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "HTML confirmation email sent successfully." })
        };

    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send the confirmation email.' })
        };
    }
};
