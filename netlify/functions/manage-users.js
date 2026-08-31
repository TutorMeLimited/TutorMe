const admin = require('firebase-admin');

if (!admin.apps.length) {
    try {
        let credential;
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS.startsWith('{')) {
            credential = admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS));
        } else {
            credential = admin.credential.applicationDefault();
        }
        
        admin.initializeApp({
            credential: credential,
            databaseURL: process.env.DATABASE_URL
        });
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
    }
}

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // 1. Authenticate the caller
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
        }
        
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        const adminUIDs = ['beMqbQLBDWaWySNx134ri1KJwQi2', 'P1gWMa5YWyWlcFwebxYEjMPzLwi2'];
        if (!adminUIDs.includes(decodedToken.uid)) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden. Admins only.' }) };
        }

        // 2. Handle GET request: List Users
        if (event.httpMethod === 'GET') {
            const listUsersResult = await admin.auth().listUsers(1000);
            const users = listUsersResult.users.map(u => ({
                uid: u.uid,
                email: u.email,
                creationTime: u.metadata.creationTime,
                lastSignInTime: u.metadata.lastSignInTime,
                disabled: u.disabled,
                isAdmin: adminUIDs.includes(u.uid)
            }));
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ users })
            };
        }
        
        // 3. Handle POST request: Delete or Suspend User
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const { action, uid } = body;
            
            if (!uid) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'UID is required.' }) };
            }
            if (adminUIDs.includes(uid)) {
                return { statusCode: 403, headers, body: JSON.stringify({ error: 'Cannot modify admin accounts.' }) };
            }

            if (action === 'delete') {
                await admin.auth().deleteUser(uid);
                return { statusCode: 200, headers, body: JSON.stringify({ message: 'User deleted successfully.' }) };
            } else if (action === 'suspend') {
                await admin.auth().updateUser(uid, { disabled: true });
                return { statusCode: 200, headers, body: JSON.stringify({ message: 'User suspended successfully.' }) };
            } else if (action === 'unsuspend') {
                await admin.auth().updateUser(uid, { disabled: false });
                return { statusCode: 200, headers, body: JSON.stringify({ message: 'User unsuspended successfully.' }) };
            } else {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action.' }) };
            }
        }

        return { statusCode: 405, headers, body: 'Method Not Allowed' };
        
    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
