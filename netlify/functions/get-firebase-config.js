/**
 * Netlify Function: get-firebase-config
 * 
 * Safely shares your Firebase settings with your website so you don't have to hardcode them.
 * This helper grabs keys from the server's environment settings so they stay hidden from prying eyes.
 */
exports.handler = async function(event) {
    // We only want this script to hand out data, not receive it.
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Let's build the Firebase configuration puzzle using our secret environment variables.
    const firebaseConfig = {
        apiKey: process.env.PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
        authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.PUBLIC_FIREBASE_DATABASE_URL || process.env.DATABASE_URL,
        projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
        measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firebaseConfig),
    };
};