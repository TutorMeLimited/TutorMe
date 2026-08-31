
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('error-message');
        const submitButton = loginForm.querySelector('.cta-btn');

        fetch('/.netlify/functions/get-firebase-config')
            .then(response => response.json())
            .then(firebaseConfig => {
                const app = firebase.initializeApp(firebaseConfig);
                const auth = firebase.auth();
                initializePage(auth);
            })
            .catch(error => {
                console.error('Failed to load Firebase config:', error);
                errorMessage.textContent = "Error: Could not load login configuration.";
            });

        function initializePage(auth) {
            // Auto sign-in if already authenticated
            auth.onAuthStateChanged(user => {
                if (user) {
                    // For admin, we should check if they are in admin list ideally, but dashboard.html does it anyway
                    window.location.href = 'dashboard.html';
                }
            });

            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = emailInput.value;
                const password = passwordInput.value;
                const rememberMe = document.getElementById('remember-me').checked;
                errorMessage.textContent = '';
                submitButton.disabled = true;
                submitButton.textContent = 'Signing In...';

                const persistenceType = rememberMe ? 'local' : 'session';

                auth.setPersistence(persistenceType)
                    .then(() => {
                        return auth.signInWithEmailAndPassword(email, password);
                    })
                    .then((userCredential) => {
                        console.log('Signed in successfully! Redirecting to dashboard...');
                        window.location.href = 'dashboard.html';
                    })
                    .catch((error) => {
                        if (error.code === 'auth/user-disabled') {
                            errorMessage.textContent = 'Your account has been suspended.';
                        } else {
                            errorMessage.textContent = 'Invalid email or password.';
                        }
                        submitButton.disabled = false;
                        submitButton.textContent = 'Sign In';
                    });
            });
        }
    
