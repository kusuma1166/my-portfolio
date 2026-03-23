document.addEventListener("DOMContentLoaded", function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    // Scroll Spy for Navigation
    const navItems = document.querySelectorAll('.nav-links a');
    const spySections = document.querySelectorAll('section');

    const spyOptions = {
        threshold: 0.5 // Trigger when 50% of section is visible
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all links
                navItems.forEach(link => link.classList.remove('active'));
                // Add active to current link
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                   activeLink.classList.add('active');
                }
            }
        });
    }, spyOptions);

    spySections.forEach(section => {
        spyObserver.observe(section);
    });

    // Smooth scrolling for navigation (Enhanced)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Close mobile menu if open
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
            }

            if (targetSection) {
                 window.scrollTo({
                    top: targetSection.offsetTop - 70, // Offset for header height
                    behavior: 'smooth'
                 });
            }
        });
    });

    // 3D Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card:not(.hidden-cert), .project-card, .cert-card:not(.hidden-cert), .skill-category');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Reveal sections on scroll with 3D transition
   const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        section.classList.add('hidden'); // Add initial hidden state
        observer.observe(section);
    });

    // Function to apply tilt effect to a card
    function applyTiltEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // View More Certificates Button
    let certsShown = false;
    const viewMoreBtn = document.getElementById('viewMoreCerts');
    
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const hiddenCerts = document.querySelectorAll('.hidden-cert');
            
            certsShown = !certsShown;
            
            hiddenCerts.forEach(cert => {
                if (certsShown) {
                    cert.classList.add('show');
                    applyTiltEffect(cert); // Apply tilt effect to newly shown cards
                } else {
                    cert.classList.remove('show');
                }
            });
            
            // Update button text
            viewMoreBtn.textContent = certsShown ? 'View Less Certificates' : 'View More Certificates';
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create mailto link
            const mailToLink = `mailto:veerakusumakumar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open default email client
            window.location.href = mailToLink;
            
            // Show success message
            alert('Opening your email client to send the message...');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Certificate Modal Functionality
    const certModal = document.getElementById('certModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalCertImage = document.getElementById('modalCertImage');
    const modalOverlay = document.querySelector('.cert-modal-overlay');
    const modalContent = document.querySelector('.cert-modal-content');
    const allCertCards = document.querySelectorAll('.cert-card');

    // Function to open modal
    function openModal(imgSrc) {
        modalCertImage.src = imgSrc;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Reset scroll position on modal
        if (certModal) {
            certModal.scrollTop = 0;
        }
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }

    // Function to close modal
    function closeModal() {
        certModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    // Open modal on certificate card click
    allCertCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent event propagation
            e.stopPropagation();
            
            // Don't open if close button is clicked
            if (e.target.closest('.cert-modal-close')) return;
            
            const certImg = this.querySelector('.cert-img-wrapper img');
            if (certImg) {
                const imgSrc = certImg.src;
                openModal(imgSrc);
            }
        });

        // Add pointer cursor on hover to show it's clickable
        card.addEventListener('mouseenter', function() {
            const certImg = this.querySelector('.cert-img-wrapper img');
            if (certImg && certImg.src) {
                this.style.cursor = 'pointer';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.cursor = 'default';
        });
    });

    // Close modal when close button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    }

    // Close modal when backdrop/overlay is clicked
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    }

    // Prevent closing when clicking content area
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Close modal when clicking outside modal (on the modal container)
    if (certModal) {
        certModal.addEventListener('click', function(e) {
            if (e.target === certModal) {
                closeModal();
            }
        });
    }

    // Handle touch events for mobile
    let touchStartY = 0;
    if (certModal) {
        certModal.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        certModal.addEventListener('touchmove', function(e) {
            // Allow scrolling
            let touchEndY = e.touches[0].clientY;
            // Don't prevent default - let scrolling happen naturally
        }, { passive: true });
    }
});

if (!("scrollBehavior" in document.documentElement.style)) {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/smoothscroll-polyfill/0.4.4/smoothscroll.min.js";
    document.head.appendChild(script);
}
