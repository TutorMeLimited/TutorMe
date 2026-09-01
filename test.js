Promise.resolve().then(() => { throw new Error('Test'); }).catch(e => console.log('Caught:', e.message));
