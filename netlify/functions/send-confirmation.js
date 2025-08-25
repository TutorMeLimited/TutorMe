const axios = require('axios');

function generateHtmlEmail(studentName, friendlyDate) {
    const accentColor = '#f72585';
    const sociologyColor = '#ffc300';
    const psychologyColor = '#a259d9';
    const physicsColor = '#4361ee';
    const textColor = '#222';
    const backgroundColor = psychologyColor; 
    return `<!DOCTYPE html> ...`;
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { studentName, studentEmail, bookedDate } = JSON.parse(event.body);
        const ZOHO_API_KEY = process.env.ZOHO_API_KEY;

        const friendlyDate = new Date(bookedDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

        const zohoApiEndpoint = 'https://api.zeptomail.com/v1.1/email';

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

        await axios.post(zohoApiEndpoint, emailPayload, {
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
