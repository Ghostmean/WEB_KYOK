// Theme handling
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.themeIcon = this.themeToggleBtn ? this.themeToggleBtn.querySelector('.toggle-icon') : null;
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// Album rating system
class RatingSystem {
    constructor() {
        this.modal = document.querySelector('.modal');
        this.closeBtn = document.querySelector('.modal__close');
        this.submitBtn = document.querySelector('.submit-rating');
        this.resetBtn = document.querySelector('.reset-rating');
        this.sliders = document.querySelectorAll('.rating__slider');
        this.averageElement = document.querySelector('.rating__average-value');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Закрытие модального окна
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Закрытие по клику вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Предотвращение закрытия при клике на контент
        this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Обработка отправки формы
        this.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitRating();
        });

        // Сброс оценок
        this.resetBtn.addEventListener('click', () => this.resetRating());

        // Обработка изменения слайдеров
        this.sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateSliderValue(slider);
                this.updateAverageRating();
            });
        });
    }

    openModal(albumId, albumTitle, albumCover) {
        this.currentAlbumId = albumId;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Обновляем информацию об альбоме
        const albumInfo = this.modal.querySelector('.album-info');
        if (albumInfo) {
            albumInfo.querySelector('h2').textContent = albumTitle;
            albumInfo.querySelector('img').src = albumCover;
        }

        // Загружаем сохраненные оценки
        this.loadSavedRatings();
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    updateSliderValue(slider) {
        const value = parseInt(slider.value);
        const valueDisplay = slider.parentElement.querySelector('.rating__value');
        const descriptionDisplay = slider.parentElement.querySelector('.rating__description');

        if (valueDisplay) {
            valueDisplay.textContent = value;
        }

        if (descriptionDisplay) {
            descriptionDisplay.textContent = this.getRatingDescription(value);
        }
    }

    getRatingDescription(value) {
        if (value >= 90) return 'Отличный';
        if (value >= 75) return 'Очень хороший';
        if (value >= 60) return 'Хороший';
        if (value >= 45) return 'Нормальный';
        if (value >= 30) return 'Плохой';
        if (value >= 15) return 'Очень плохой';
        return 'Ужасный';
    }

    updateAverageRating() {
        let sum = 0;
        let count = 0;

        this.sliders.forEach(slider => {
            const value = parseInt(slider.value);
            if (!isNaN(value)) {
                sum += value;
                count++;
            }
        });

        const average = count > 0 ? Math.round(sum / count) : 0;

        if (this.averageElement) {
            this.averageElement.textContent = average;
        }
    }

    loadSavedRatings() {
        const savedRatings = localStorage.getItem(`album_rating_${this.currentAlbumId}`);
        if (savedRatings) {
            const ratings = JSON.parse(savedRatings);
            this.sliders.forEach(slider => {
                const criteria = slider.getAttribute('data-criteria');
                if (ratings[criteria]) {
                    slider.value = ratings[criteria];
                    this.updateSliderValue(slider);
                }
            });
            this.updateAverageRating();
        } else {
            this.resetRating();
        }
    }

    submitRating() {
        const ratings = {};
        this.sliders.forEach(slider => {
            const criteria = slider.getAttribute('data-criteria');
            ratings[criteria] = parseInt(slider.value);
        });

        localStorage.setItem(`album_rating_${this.currentAlbumId}`, JSON.stringify(ratings));

        // Показываем уведомление об успешном сохранении
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Оценка успешно сохранена';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            this.closeModal();
        }, 2000);
    }

    resetRating() {
        this.sliders.forEach(slider => {
            slider.value = 50; // Начальное значение 50
            this.updateSliderValue(slider);
        });
        this.updateAverageRating();
    }
}

// Album data management
class AlbumManager {
    constructor() {
        this.albums = [];
        this.init();
    }

    async init() {
        try {
            const response = await fetch('data/albums.json');
            const data = await response.json();
            this.albums = data.albums;
            this.renderAlbums();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error loading albums:', error);
        }
    }

    renderAlbums() {
        const container = document.querySelector('.swiper-wrapper');
        if (!container) return;

        container.innerHTML = this.albums.map(album => this.createAlbumCard(album)).join('');

        // Initialize Swiper after rendering
        new Swiper('.album-carousel', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                640: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            }
        });
    }

    createAlbumCard(album) {
        return `
            <div class="swiper-slide">
                <div class="album-card" data-album="${album.id}">
                    <img src="${album.cover}" alt="${album.title}" class="album-card__image">
                    <div class="album-card__info">
                        <h3 class="album-card__title">
                            <a href="pages/albums/album.html?id=${album.id}&type=album">${album.title}</a>
                        </h3>
                        <p class="album-card__year">${album.year}</p>
                        <button class="album-card__rate-btn">Оценить альбом</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.querySelector('.albums-section').addEventListener('click', (e) => {
            const rateBtn = e.target.closest('.album-card__rate-btn');
            if (rateBtn) {
                const albumCard = rateBtn.closest('.album-card');
                const albumId = albumCard.dataset.album;
                const album = this.albums.find(a => a.id === albumId);
                if (album) {
                    ratingSystem.openModal(albumId, album.title, album.cover);
                }
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    window.ratingSystem = new RatingSystem();
    new AlbumManager();
});