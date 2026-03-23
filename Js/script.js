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
    'book-1': { title: 'Parker’s Astrology', author: 'Julia Parker & Derek Parker', published: '1991', content: `A comprehensive and timeless guide to understanding astrology in everyday life. This book introduces the foundations of zodiac signs, planets, houses, and birth charts. It explains how celestial movements influence personality, emotions, and life direction. Readers learn how to interpret their own natal chart with clarity and confidence.

        The Parkers combine traditional knowledge with practical, modern application.

        Astrology becomes not just a belief, but a tool for self-awareness and reflection. It offers insight into compatibility, relationships, and personal growth. Each element of the chart reveals a deeper layer of identity and potential. The book encourages readers to see patterns rather than coincidences. Ultimately, it empowers you to understand your life through the language of the stars.` },
    'book-2': { title: 'Frequency: The Power of Personal Vibration', author: 'Penney Peirce', published: '2009', content: `Everything in the universe operates on frequency, including your thoughts, emotions, and experiences. This book explores how your personal vibration shapes the reality you live in every day. Penney Peirce explains how awareness of energy can transform the way you see yourself and others.

        By recognizing emotional patterns, you begin to shift into higher, more positive states of being. The book connects intuition, consciousness, and energy into a practical life approach. It teaches how to release fear-based thinking and align with clarity and inner truth.

        As your frequency rises, so does your ability to attract meaningful experiences. You become more present, intentional, and connected to your purpose. It is not about changing the world around you, but changing your internal state. Through that shift, your external reality begins to transform naturally.` },
    'book-3': { title: 'Astrology & Numerology', author: 'Sofia Visconti', published: '2018', content: `Your life is influenced by more than what you can see; it is written in numbers and stars. This book combines astrology and numerology to reveal hidden patterns in your life path. It explains how your birth date holds powerful meaning about your personality and destiny.

        Numbers are presented as energetic forces that shape decisions and opportunities. Astrological signs add another layer, revealing emotional and behavioral tendencies.

        Together, they form a system that helps you better understand yourself and others. The book explores themes of success, relationships, and personal fulfillment. It provides simple interpretations that are accessible even for beginners. Readers are guided to discover their strengths, weaknesses, and life purpose. It is a journey into self-discovery through symbols that have existed for centuries.` },
    'book-4': { title: 'The Creation Frequency', author: 'Mike Murphy', published: '2017', content: `Your thoughts are not passive; they are constantly shaping your reality. This book explores how aligning with the creation frequency influences your life path. Mike Murphy blends spirituality with practical mindset techniques. He emphasizes awareness as the key to intentional living.

        By becoming conscious of your thoughts, you begin to direct your own outcomes.

        The book encourages shifting from reaction to creation. It teaches how to replace doubt and fear with purpose and clarity. Readers are guided to tune into a higher state of thinking and feeling. This alignment allows opportunities and ideas to flow more naturally. Ultimately, it is about realizing that you are not just experiencing life; you are creating it.` },
    'book-5': { title: 'The Art of Thinking Clearly', author: 'Rolf Dobelli', published: '2013', content: `Why do we make irrational decisions without realizing it? This book explores the hidden biases that influence how we think every day. Rolf Dobelli breaks down complex psychological concepts into simple insights. Each chapter highlights a specific thinking error, from overconfidence to confirmation bias.

        These mental shortcuts often lead to poor judgment and unnecessary mistakes. By becoming aware of them, you gain control over your decision-making process. The book encourages slow, deliberate thinking instead of impulsive reactions.

        It applies to business, relationships, and everyday life situations. Clear thinking becomes a skill that can be practiced and improved. In the end, understanding how you think is the first step to thinking better.` },
    'book-6': { title: 'Building a StoryBrand', author: 'Donald Miller', published: '2017', content: `In a world full of noise, clarity is what makes a brand stand out. Donald Miller introduces the StoryBrand framework, inspired by classic storytelling. He explains that customers should be the hero, not the brand.

        Businesses succeed when they position themselves as a guide with a clear solution. The book breaks down how to simplify messages so people instantly understand value. It focuses on empathy, clarity, and strong calls to action.

        Through storytelling structure, brands become more relatable and trustworthy. Marketing is no longer about complexity, but about connection. Each chapter offers practical steps to refine communication and strategy. The result is a brand message that resonates, engages, and converts.` }
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
    
    const configuredStartIndex = Number(carousel.getAttribute('data-start-index'));
    let currentIndex = Number.isFinite(configuredStartIndex)
        ? Math.min(Math.max(Math.floor(configuredStartIndex), 0), total - 1)
        : 0;
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
        detailPanel.innerHTML = `<h4 class="book-detail-title">${book.title}</h4><p style="color: #d5b15d; margin-bottom: 15px; font-weight: 500; display: flex; justify-content: space-between; align-items: center;"><span>by ${book.author}</span><span>Published in ${book.published || 'N/A'}</span></p><p class="book-detail-content">${book.content}</p>`;
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

