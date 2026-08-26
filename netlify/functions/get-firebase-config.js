exports.handler = async function() {
/**
 * Netlify Function: get-firebase-config
 * 
 * Securely provides the public Firebase configuration to the frontend.
 * This function reads the configuration from environment variables on the server-side,
 * preventing sensitive keys from being exposed directly in the client-side code.
 */
exports.handler = async function(event) {
    // This function should only respond to GET requests.
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Construct the Firebase config object from environment variables.
    const firebaseConfig = {
        apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    };

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firebaseConfig),
    };
};