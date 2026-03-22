// Smooth scroll
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

// BOOK SECTION INTERACTIVITY
const bookData = {
    'book-1': { title: 'The Midnight Library', author: 'Matt Haig', content: 'A profound exploration of infinite possibilities and second chances. This book explores the intersection of regret, hope, and self-discovery. Haig beautifully illustrates how every choice we make shapes our life, and that it\'s never too late to find meaning and happiness.' },
    'book-2': { title: 'Atomic Habits', author: 'James Clear', content: 'A powerful guide to building good habits and breaking bad ones. Clear\'s approach focuses on small, incremental changes that compound over time. This book has fundamentally changed how I approach personal growth and daily routines.' },
    'book-3': { title: 'Deep Work', author: 'Cal Newport', content: 'An essential read for anyone serious about their craft. Newport argues that the ability to focus intensely on cognitively demanding tasks is increasingly rare and valuable. This book inspired me to restructure my work habits.' },
    'book-4': { title: 'The Design of Everyday Things', author: 'Don Norman', content: 'A foundational text for understanding user-centered design. Norman explains why some products are intuitive while others are confusing. Essential reading for anyone involved in design or UX.' },
    'book-5': { title: 'Thinking Fast and Slow', author: 'Daniel Kahneman', content: 'An exploration of the two systems of thought that drive human decision-making. Kahneman\'s insights into cognitive biases have profoundly influenced how I think about judgment and risk.' },
    'book-6': { title: 'Start with Why', author: 'Simon Sinek', content: 'A thought-provoking meditation on purpose and leadership. Sinek\'s concept of finding your why has become central to how I approach both work and personal projects.' }
};

function initLinearCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const btnPrev = carousel.querySelector('.carousel-btn-prev');
        const btnNext = carousel.querySelector('.carousel-btn-next');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');

    if (!track || !items.length) return;

    const total = items.length;
    const autoplay = carousel.getAttribute('data-autoplay') === 'true';
    const interval = Number(carousel.getAttribute('data-interval')) || 4500;
    
    let currentIndex = 0;
    let timerId = null;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;

    // Create indicators (hidden)
    indicatorsContainer.innerHTML = '';
    indicatorsContainer.style.display = 'none';

    const updateCenterItem = () => {
        items.forEach((item, index) => {
            item.classList.remove('is-center');
            if (index === currentIndex) {
                item.classList.add('is-center');
            }
        });
    };

        const updateButtonStates = () => {
            btnPrev.disabled = currentIndex === 0;
            btnNext.disabled = currentIndex === total - 1;
        };

    const updateIndicators = () => {
        // Indicators disabled
    };

    const calculateOffset = () => {
        let offset = 0;
        const itemWidth = items[0].offsetWidth;
        const gap = 20;
        const viewportWidth = carousel.querySelector('.carousel-viewport').offsetWidth;
        
        offset = -(currentIndex * (itemWidth + gap)) + (viewportWidth / 2) - (itemWidth / 2);
        return offset;
    };

    const updateTrackPosition = () => {
        const offset = calculateOffset();
        track.style.transform = `translateX(${offset}px)`;
        updateCenterItem();
            updateButtonStates();
        updateIndicators();
    };

    const goToSlide = (index) => {
        if (index < 0 || index >= total) return;
        currentIndex = index;
        updateTrackPosition();
    };

    const nextSlide = () => {
        if (currentIndex < total - 1) {
            goToSlide(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        if (autoplay) {
            timerId = setInterval(nextSlide, interval);
        }
    };

    const stopAutoplay = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    const restartAutoplay = () => {
        startAutoplay();
    };

    // Click events
    btnPrev.addEventListener('click', () => {
            if (btnPrev.disabled) return;
        prevSlide();
        restartAutoplay();
    });

    btnNext.addEventListener('click', () => {
            if (btnNext.disabled) return;
        nextSlide();
        restartAutoplay();
    });

    // Item click to bring to center
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index !== currentIndex) {
                goToSlide(index);
                restartAutoplay();
            }
        });
    });

    // Touch swipe
    carousel.addEventListener('touchstart', (e) => {
        stopAutoplay();
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        dragOffset = currentX - startX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (Math.abs(dragOffset) > 50) {
            if (dragOffset > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        restartAutoplay();
    });

    // Mouse drag (optional)
    let mouseDown = false;
    track.addEventListener('mousedown', (e) => {
        mouseDown = true;
        startX = e.clientX;
        stopAutoplay();
        track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        currentX = e.clientX;
        dragOffset = currentX - startX;
        const offset = calculateOffset() + dragOffset;
        track.style.transform = `translateX(${offset}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!mouseDown) return;
        mouseDown = false;
        track.style.cursor = 'grab';
        
        if (Math.abs(dragOffset) > 50) {
            if (dragOffset > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            updateTrackPosition();
        }
        restartAutoplay();
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', restartAutoplay);

    // Pause when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Initialize
    updateTrackPosition();
    startAutoplay();

        // Set initial button states
        updateButtonStates();
}

function updateDetailPanel(bookId) {
    const book = bookData[bookId];
    const detailPanel = document.getElementById('book-detail-panel');
    if (book) {
        detailPanel.innerHTML = `<h4 class="book-detail-title">${book.title}</h4><p style="color: #d5b15d; margin-bottom: 15px; font-weight: 500;">by ${book.author}</p><p class="book-detail-content">${book.content}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const bookItems = document.querySelectorAll('.book-item');
    bookItems.forEach(item => {
        item.addEventListener('click', function() {
            bookItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            updateDetailPanel(this.getAttribute('data-book-id'));
        });
    });
    if (bookItems.length > 0) {
        bookItems[0].classList.add('active');
        updateDetailPanel(bookItems[0].getAttribute('data-book-id'));
    }

    const linearCarousels = document.querySelectorAll('.linear-carousel');
    linearCarousels.forEach(carousel => {
        initLinearCarousel(carousel);
    });
});

// Simple animation on scroll
window.addEventListener("scroll", () => {
    document.querySelectorAll(".section").forEach(section => {
        let position = section.getBoundingClientRect().top;
        let screen = window.innerHeight;

        if(position < screen - 100){
            section.classList.add("show");
        }
    });
});

