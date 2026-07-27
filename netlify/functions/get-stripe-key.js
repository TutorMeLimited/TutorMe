exports.handler = async function() {
    return {
        statusCode: 200,
        body: JSON.stringify({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY }),
    };
};