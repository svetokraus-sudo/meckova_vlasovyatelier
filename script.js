document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Mobilné Menu (Hamburger) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Zavretie menu po kliknutí na odkaz
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- 2. Sticky Navbar with Smooth Hide/Show ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Show/hide navbar on scroll
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
            
            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > navbarHeight) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (currentScroll > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // --- 3. Smooth Scroll with Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Back to Top Button ---
    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 5. Animate Numbers in Stats - RÝCHLEJŠIE ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let numbersAnimated = false;

    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const plusSign = stat.getAttribute('data-target').includes('+');
            const duration = 800; // Zmenšené z 2000 na 800 (rýchlejšie!)
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (plusSign && current >= target ? '+' : '');
            }, 16);
        });
    }

    // --- 6. Scroll Animations ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
                
                // Animate numbers when about section is visible
                if (element.classList.contains('stat-card') && !numbersAnimated) {
                    setTimeout(animateNumbers, 200);
                    numbersAnimated = true;
                }
            }
        });
    }

    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);

// --- 7. GALÉRIA FUNKCIONALITA S LIGHTBOXOM ---
const galleryModal = document.getElementById('galleryModal');
const modalTitle = document.getElementById('modalTitle');
const galleryGrid = document.getElementById('galleryGrid');
const closeModalBtn = galleryModal.querySelector('.close-modal');
const categoryCards = document.querySelectorAll('.category-card');

// Lightbox elementy
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// Galéria obrázkov pre každú kategóriu - NASTAV SI TU SVOJE FOTKY!
const galleryData = {
    'damske': {
        title: 'Dámske strihy',
        images: [
            'obrZ/IMG_3538.jpg',
            'obrZ/IMG_3539.jpg', 
            'obrZ/IMG_3540.jpg', 
            'obrZ/IMG_3541.jpg',
            'obrZ/IMG_3542.jpg',
            'obrZ/IMG_3544.jpg',
            'obrZ/IMG_3546.jpg'
        ]
    },
    'panske': {
        title: 'Pánske strihy',
        images: [
            'obrM/IMG_3530.jpg',
            'obrM/IMG_3531.jpg', 
            'obrM/IMG_3532.jpg',
            'obrM/IMG_3533.jpg',
            'obrM/IMG_3534.jpg',
            'obrM/IMG_3535.jpg',
            'obrM/IMG_3536.jpg'
        ]
    }
};

let currentGallery = null;
let currentImageIndex = 0;

// Otvorenie galérie po kliknutí na kategóriu
categoryCards.forEach(card => {
    card.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        const categoryData = galleryData[category];
        
        if (categoryData) {
            currentGallery = category;
            modalTitle.textContent = categoryData.title;
            galleryGrid.innerHTML = '';
            
            // Naplnenie galérie obrázkami
            categoryData.images.forEach((imgSrc, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-item';
                
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = `${categoryData.title} ${index + 1}`;
                imgElement.loading = 'lazy';
                imgElement.dataset.index = index;
                
                imgContainer.appendChild(imgElement);
                galleryGrid.appendChild(imgContainer);
                
                // Event pre otvorenie lightboxu
                imgElement.addEventListener('click', function() {
                    openLightbox(category, parseInt(this.dataset.index));
                });
            });
            
            // Zobrazenie modálneho okna
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Funkcie pre lightbox
function openLightbox(gallery, index) {
    const galleryDataItem = galleryData[gallery];
    if (!galleryDataItem) return;
    
    currentGallery = gallery;
    currentImageIndex = index;
    
    lightboxImage.src = galleryDataItem.images[index];
    lightboxCaption.textContent = `${galleryDataItem.title} - ${index + 1}/${galleryDataItem.images.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

function showPrevImage() {
    const galleryDataItem = galleryData[currentGallery];
    if (!galleryDataItem) return;
    
    currentImageIndex = (currentImageIndex - 1 + galleryDataItem.images.length) % galleryDataItem.images.length;
    lightboxImage.src = galleryDataItem.images[currentImageIndex];
    lightboxCaption.textContent = `${galleryDataItem.title} - ${currentImageIndex + 1}/${galleryDataItem.images.length}`;
}

function showNextImage() {
    const galleryDataItem = galleryData[currentGallery];
    if (!galleryDataItem) return;
    
    currentImageIndex = (currentImageIndex + 1) % galleryDataItem.images.length;
    lightboxImage.src = galleryDataItem.images[currentImageIndex];
    lightboxCaption.textContent = `${galleryDataItem.title} - ${currentImageIndex + 1}/${galleryDataItem.images.length}`;
}

// Event listeners pre lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Zatvorenie lightboxu kliknutím mimo obrázka
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation pre lightbox
document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});

// Zatvorenie modálneho okna galérie
closeModalBtn.addEventListener('click', closeGalleryModal);
galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) {
        closeGalleryModal();
    }
});

function closeGalleryModal() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
}
    // --- 8. Aktuálny rok v footeri ---
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;

    // --- 9. Parallax Effect on Hero Section ---
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translate3d(0, ${rate}px, 0) scale(${1 + (scrolled * 0.0002)})`;
        });
    }

    // --- 10. Interactive Cards Hover Effects ---
    const benefitCards = document.querySelectorAll('.benefit-card, .info-card');
    
    benefitCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
    });

    // --- 11. Page Load Animation ---
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
    });

    // --- 12. Scroll Progress Indicator ---
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-green), var(--accent-gold));
        z-index: 1001;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // --- 13. Keyboard Support for Modal ---
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
            closeGalleryModal();
        }
    });

    console.log('MECKOVA website initialized with all requested features! 🎨✨');
});