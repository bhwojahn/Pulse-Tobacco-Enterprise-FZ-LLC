// ============================================
// AGE VERIFICATION MODAL
// ============================================

(function() {
    // Check if user has already verified
    if (localStorage.getItem('ageVerified') === 'true') {
        return;
    }

    // Inject styles
    const styles = `
        <style>
            #age-verification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(5, 2, 29, 0.22);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #age-verification-modal {
                background: #05021d;
                border: 2px solid #C2BA79;
                padding: 60px 80px;
                text-align: center;
                max-width: 500px;
                width: 90%;
            }

            #age-verification-modal h2 {
                font-family: 'Arkhip', 'Helvetica Neue', Arial, sans-serif;
                font-size: 2rem;
                letter-spacing: 0.1em;
                color: #dde0ad;
                margin-bottom: 30px;
                font-weight: bold;
            }

            #age-verification-modal p {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 1.1rem;
                color: #dde0ad;
                margin-bottom: 40px;
                line-height: 1.6;
                font-weight: 300;
            }

            .age-verification-buttons {
                display: flex;
                gap: 20px;
                justify-content: center;
            }

            .age-verification-btn {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                padding: 15px 40px;
                background: transparent;
                border: 2px solid #C2BA79;
                color: #C2BA79;
                font-size: 1rem;
                font-weight: 500;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .age-verification-btn:hover {
                background: #C2BA79;
                color: #05021d;
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(194, 186, 121, 0.3);
            }

            .age-verification-btn.no-btn:hover {
                background: transparent;
                border-color: #ff4444;
                color: #ff4444;
                transform: translateY(0);
                box-shadow: none;
            }

            #age-verification-message {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 1.1rem;
                color: #ff4444;
                margin-top: 30px;
                display: none;
                font-weight: 300;
            }

            @media screen and (max-width: 768px) {
                #age-verification-modal {
                    padding: 40px 30px;
                }

                #age-verification-modal h2 {
                    font-size: 1.5rem;
                }

                #age-verification-modal p {
                    font-size: 1rem;
                }

                .age-verification-buttons {
                    flex-direction: column;
                }

                .age-verification-btn {
                    width: 100%;
                }
            }
        </style>
    `;

    // Inject HTML
    const html = `
        <div id="age-verification-overlay">
            <div id="age-verification-modal">
                <h2>AGE VERIFICATION</h2>
                <p>You must be 18 years or older to access this website.</p>
                <div class="age-verification-buttons">
                    <button class="age-verification-btn yes-btn" id="age-verify-yes">YES, I AM 18+</button>
                    <button class="age-verification-btn no-btn" id="age-verify-no">NO, I AM NOT</button>
                </div>
                <p id="age-verification-message">You must be 18 or older to access this site.</p>
            </div>
        </div>
    `;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Inject styles and HTML
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('afterbegin', html);

        // Prevent scrolling
        document.body.style.overflow = 'hidden';

        // Get elements
        const yesBtn = document.getElementById('age-verify-yes');
        const noBtn = document.getElementById('age-verify-no');
        const message = document.getElementById('age-verification-message');
        const overlay = document.getElementById('age-verification-overlay');

        // Yes button - grant access
        yesBtn.addEventListener('click', function() {
            localStorage.setItem('ageVerified', 'true');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        });

        // No button - show message
        noBtn.addEventListener('click', function() {
            message.style.display = 'block';
            yesBtn.disabled = false;
        });
    }
})();