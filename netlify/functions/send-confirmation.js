const axios = require('axios');

/**
 * Generates a branded HTML email for the booking confirmation.
 * @param {string} studentName - The name of the student.
 * @param {string} friendlyDate - The pre-formatted date and time of the booking.
 * @returns {string} The full HTML content of the email.
 */
function generateHtmlEmail(studentName, friendlyDate) {
    const accentColor = '#f72585';
    const sociologyColor = '#ffc300';
    const psychologyColor = '#a259d9';
    const physicsColor = '#4361ee';
    const textColor = '#222';
    // The main theme color for this email template.
    const backgroundColor = psychologyColor;
    return `<!DOCTYPE html> ...`;
}

/**
 * Netlify Function handler for sending a booking confirmation email via Zoho ZeptoMail.
 * This function is triggered after a successful booking to notify the student.
 */
exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Define the API endpoint for Zoho ZeptoMail.
    const ZOHO_API_ENDPOINT = 'https://api.zeptomail.com/v1.1/email';

    try {
        const { studentName, studentEmail, bookedDate } = JSON.parse(event.body);

        // Validate that all required fields are present.
        if (!studentName || !studentEmail || !bookedDate) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: studentName, studentEmail, or bookedDate.' }) };
        }

        const ZOHO_API_KEY = process.env.ZOHO_API_KEY;
        const friendlyDate = new Date(bookedDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

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

        await axios.post(ZOHO_API_ENDPOINT, emailPayload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZOHO_API_KEY}`
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
