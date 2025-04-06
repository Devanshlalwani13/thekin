document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const landingPage = document.getElementById('landing');
    const upcomingEventsSection = document.getElementById('upcoming-events');
    const signupPage = document.getElementById('signup-page');
    const aboutModal = document.getElementById('about-us-modal');
    const contactModal = document.getElementById('contact-modal');
    const mainSignupLink = document.getElementById('main-signup-link');
    const bottomSignupLink = document.getElementById('bottom-signup-link');
    const aboutButton = document.getElementById('about-btn');
    const contactButton = document.getElementById('contact-btn');
    const backButtons = document.querySelectorAll('.back-btn:not(.modal-back-btn)');
    const modalCloseButtons = document.querySelectorAll('.modal-back-btn');

    let currentPage = 'landing';
    // Match CSS variables
    const transitionDuration = 600;
    const modalTransitionDuration = 400;

    console.log('Script Loaded. Modals found:', { aboutModal, contactModal }); // DEBUG

    // --- Animation Functions ---
    const animateSignupText = () => {
        if (!signupPage) return;
        const lines = signupPage.querySelectorAll('.animate-line');
        lines.forEach(line => line.classList.remove('visible'));
        lines.forEach((line, index) => {
             requestAnimationFrame(() => {
                setTimeout(() => { line.classList.add('visible'); }, index * 150 );
             });
        });
    };
    const resetSignupText = () => {
        if (!signupPage) return;
        const lines = signupPage.querySelectorAll('.animate-line');
        lines.forEach(line => { line.classList.remove('visible'); });
    };
    const animateAboutText = () => {
        if (!aboutModal) return;
        const paragraphs = aboutModal.querySelectorAll('.modal-content p.animate-paragraph');
        paragraphs.forEach(p => p.classList.remove('visible'));
        paragraphs.forEach((p, index) => { p.style.transitionDelay = `${index * 0.18}s`; p.classList.add('visible'); });
    };
    const resetAboutText = () => {
        if (!aboutModal) return;
        const paragraphs = aboutModal.querySelectorAll('.modal-content p.animate-paragraph');
        paragraphs.forEach(p => { p.style.transitionDelay = '0s'; p.classList.remove('visible'); });
    };

    // --- Generic Modal Functions ---
    const openModal = (modalElement) => {
        if (!modalElement) {
            console.error('openModal: No modal element provided.'); // DEBUG
            return;
        }
        console.log('Attempting to open modal:', modalElement.id); // DEBUG
        modalElement.classList.remove('hidden'); // Make it part of the layout first

        // Use rAF to ensure the 'hidden' removal is processed before adding 'visible'
        requestAnimationFrame(() => {
            modalElement.classList.add('visible'); // Add class to trigger opacity transition
            console.log('Added .visible to:', modalElement.id); // DEBUG

            // Trigger specific animations if needed
            if (modalElement.id === 'about-us-modal') {
                // Delay slightly to ensure modal is visible
                 setTimeout(animateAboutText, 50);
            }
        });
    };

    const closeModal = (modalElement) => {
        if (!modalElement || modalElement.classList.contains('hidden')) {
             // console.log('closeModal: Modal already hidden or not found:', modalElement?.id); // DEBUG (Optional)
            return;
        }
        console.log('Attempting to close modal:', modalElement.id); // DEBUG
        modalElement.classList.remove('visible'); // Remove class to trigger opacity transition

        // Reset specific animations if needed
        if (modalElement.id === 'about-us-modal') {
            resetAboutText();
        }

        // Add 'hidden' AFTER the transition completes
        setTimeout(() => {
            modalElement.classList.add('hidden'); // Hide it completely
            console.log('Added .hidden to:', modalElement.id); // DEBUG
        }, modalTransitionDuration);
    };

    // --- Page Navigation Function ---
    const showPage = (pageToShow) => {
        const allPages = [landingPage, upcomingEventsSection, signupPage].filter(el => el);
        const allModals = [aboutModal, contactModal].filter(el => el);

        // 1. Close any open modals first
        allModals.forEach(modal => closeModal(modal));

        // 2. Hide currently visible pages (add .hidden)
        allPages.forEach(page => {
             // Check if the page exists and is not the target page and is not already hidden
             if (page && page.id !== pageToShow && !page.classList.contains('hidden')) {
                 // Special handling for landing page sections
                 if (pageToShow === 'landing') {
                     // If navigating TO landing, don't hide landing/upcoming immediately
                     // They will be shown later if needed.
                     if (page.id !== 'landing' && page.id !== 'upcoming-events') {
                         page.classList.add('hidden');
                     }
                 } else {
                      // If navigating AWAY from landing, ensure upcoming events is hidden
                     if (page.id === 'upcoming-events') {
                         page.classList.add('hidden');
                     }
                     // Hide any other non-target page
                     if (page.id !== 'landing') { // Don't hide landing if target is signup
                        page.classList.add('hidden');
                     }
                 }
             }
         });


        // 3. Reset animations
        if (pageToShow !== 'signup') resetSignupText();

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 4. Show the target page (remove .hidden, add .slide-in)
        setTimeout(() => { // Delay ensures hiding happens first
            let pageElementToShow = null;
            if (pageToShow === 'landing') {
                currentPage = 'landing';
                if (landingPage) landingPage.classList.remove('hidden');
                if (upcomingEventsSection) upcomingEventsSection.classList.remove('hidden');
                 // No slide-in needed for landing sections
            } else if (pageToShow === 'signup') {
                currentPage = 'signup';
                 // Also ensure landing sections are hidden when showing signup
                 if (landingPage) landingPage.classList.add('hidden');
                 if (upcomingEventsSection) upcomingEventsSection.classList.add('hidden');
                pageElementToShow = signupPage;
            }

            if (pageElementToShow) {
                pageElementToShow.classList.remove('hidden');
                 // Use rAF for triggering the transition class
                 requestAnimationFrame(() => {
                    pageElementToShow.classList.add('slide-in');
                    if (pageToShow === 'signup') {
                        setTimeout(animateSignupText, transitionDuration * 0.4);
                    }
                 });
            }
        }, 50); // Small delay
    };


    // --- Event Listeners ---
    const handleSignupClick = (event) => {
        event.preventDefault(); showPage('signup'); history.pushState({ page: 'signup' }, '', '#signup');
    };
    if (mainSignupLink) mainSignupLink.addEventListener('click', handleSignupClick);
    if (bottomSignupLink) bottomSignupLink.addEventListener('click', handleSignupClick);

    if (aboutButton) { aboutButton.addEventListener('click', () => openModal(aboutModal)); }

    if (contactButton) {
        contactButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Contact button clicked!'); // DEBUG
            openModal(contactModal);
        });
    } else {
        console.error('Contact button (#contact-btn) not found!'); // DEBUG
    }

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalToClose = button.closest('.modal');
            console.log('Modal close button clicked for:', modalToClose?.id); // DEBUG
            closeModal(modalToClose);
        });
    });

    backButtons.forEach(button => {
         button.addEventListener('click', (e) => {
             e.preventDefault();
             showPage('landing');
             // Clean up URL hash and state
             history.pushState({ page: 'landing' }, '', window.location.pathname.split('#')[0]);
         });
     });

    // --- Initial State & History ---
    const currentHash = window.location.hash;
    if (currentHash === '#signup') {
        if(signupPage) {
            // Apply final state directly without transition on initial load
            if (landingPage) landingPage.classList.add('hidden');
            if (upcomingEventsSection) upcomingEventsSection.classList.add('hidden');
            signupPage.classList.remove('hidden');
            signupPage.classList.add('slide-in'); // Add final state class
            currentPage = 'signup';
            animateSignupText(); // Animate text immediately
        }
    } else {
        // Default load to landing
        if (signupPage) signupPage.classList.add('hidden'); // Ensure signup page is hidden
        currentPage = 'landing';
        if (landingPage) landingPage.classList.remove('hidden');
        if (upcomingEventsSection) upcomingEventsSection.classList.remove('hidden');
    }

    // --- Browser back/forward ---
     window.addEventListener('popstate', (event) => {
         const state = event.state;
         const hash = window.location.hash;

         console.log('Popstate event:', { state, hash }); // DEBUG

         // Prioritize hash, then state for signup
         if (hash === '#signup' || (state && state.page === 'signup')) {
             showPage('signup');
         } else {
             // Default back to landing if hash is not signup or no state defined
             showPage('landing');
         }
     });


}); // End of DOMContentLoaded