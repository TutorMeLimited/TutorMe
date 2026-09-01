
        const portalContainer = document.getElementById('portal-container');
        const authMessage = document.getElementById('auth-message');
        const signOutLink = document.getElementById('sign-out-link');

        fetch('/.netlify/functions/get-firebase-config')
            .then(response => response.json())
            .then(firebaseConfig => {
                firebase.initializeApp(firebaseConfig);
                const auth = firebase.auth();

                auth.onAuthStateChanged(user => {
                    if (user) {
                        authMessage.style.display = 'none';
                        portalContainer.style.display = 'block';
                        signOutLink.style.display = 'inline';
                    } else {
                        window.location.href = 'client-login.html';
                    }
                });

                signOutLink.addEventListener('click', () => auth.signOut());
            })
            .catch(error => {
                console.error('Failed to load Firebase config:', error);
                authMessage.innerHTML = <p style='color:var(--accent);'>Error loading portal configuration.</p>;
            });
    
