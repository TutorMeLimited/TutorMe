// This is the updated serverless function for sending a branded HTML email.

const axios = require('axios');

/**
 * A helper function to generate the full HTML content for the confirmation email.
 * HTML emails use inline CSS and table-based layouts for maximum compatibility.
 * @param {string} studentName - The name of the student who booked.
 * @param {string} friendlyDate - The formatted date and time of the booking.
 * @returns {string} The complete HTML document as a string.
 */
function generateHtmlEmail(studentName, friendlyDate) {
    // These are the brand colors from your styles.css file
    const accentColor = '#f72585';
    const sociologyColor = '#ffc300';
    const psychologyColor = '#a259d9';
    const physicsColor = '#4361ee';
    const textColor = '#222';
    const backgroundColor = psychologyColor; // Fallback solid background color

    // This is a full HTML email template. It looks complex because it includes special code
    // (VML) to make the gradient background work in tricky email clients like Outlook.
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Tutormee</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${backgroundColor};">
        <!--[if mso | IE]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
            <v:fill type="gradient" color="${physicsColor}" color2="${sociologyColor}" angle="135" />
        </v:background>
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 40px 15px; background: linear-gradient(135deg, ${sociologyColor}, ${psychologyColor}, ${physicsColor});">
                    <!-- Main Content Wrapper -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <h1 style="font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff; font-size: 32px; margin: 0;">Tutormee</h1>
                            </td>
                        </tr>
                        <!-- White Content Box -->
                        <tr>
                            <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 16px;">
                                <h2 style="font-family: 'Segoe UI', Arial, sans-serif; color: ${accentColor}; font-size: 24px; margin-top: 0;">
                                    Your Booking is Confirmed!
                                </h2>
                                <p style="font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor}; font-size: 16px; line-height: 1.5;">
                                    Hi ${studentName},
                                </p>
                                <p style="font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor}; font-size: 16px; line-height: 1.5;">
                                    Thank you for booking your free consultation with Tutormee. We have you scheduled for:
                                </p>
                                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f0f0; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
                                    <p style="font-size: 18px; font-weight: bold; color: ${textColor}; margin: 0;">
                                        ${friendlyDate}
                                    </p>
                                </div>
                                <p style="font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor}; font-size: 16px; line-height: 1.5;">
                                    We will be in touch shortly with more details. We look forward to helping you on your success journey!
                                </p>
                                <p style="font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor}; font-size: 16px; line-height: 1.5; margin-bottom: 0;">
                                    Best regards,<br><b>The Tutormee Team</b>
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <p style="font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff; font-size: 14px; margin: 0;">
                                    &copy; ${new Date().getFullYear()} Tutormee | <a href="https://www.tutormee.co.uk" style="color: #ffffff;">www.tutormee.co.uk</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

// The main serverless function handler
exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { studentName, studentEmail, bookedDate } = JSON.parse(event.body);
        const ZOHO_API_KEY = process.env.ZOHO_API_KEY;

        // Format the date into a more human-readable string
        const friendlyDate = new Date(bookedDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

        // --- Prepare the Email using our HTML generator ---
        const zohoApiEndpoint = 'https://mailer.zoho.com/api/v1/sendemail';
        
        const emailPayload = {
            fromAddress: "contact@tutormee.co.uk",
            toAddress: studentEmail,
            ccAddress: "bookings@tutormee.co.uk",
            subject: "Your Tutormee Consultation is Confirmed!",
            // Use the 'htmlContent' key instead of 'content'
            htmlContent: generateHtmlEmail(studentName, friendlyDate)
        };

        // --- Send the Email via Zoho's API ---
        await axios.post(zohoApiEndpoint, emailPayload, {
            headers: {
                'Authorization': `Zoho-Api-Key ${ZOHO_API_KEY}`
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