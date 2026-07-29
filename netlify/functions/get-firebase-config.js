exports.handler = async function() {
    // These keys are generally considered safe to be exposed on the client-side.
    // They will be read from your Netlify environment variables.
    const firebaseConfig = {
        apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firebaseConfig),
    };
};