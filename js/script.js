// Глобальные переменные
let albums = [];
let singles = [];
let topTracks = [];
let currentTheme = localStorage.getItem('theme') || 'light';
let albumRatings = JSON.parse(localStorage.getItem('albumRatings') || '{}');

// Функция для определения базового пути к JSON файлам
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../..';
    }
    return '.';
}

// Загрузка данных из JSON файлов
async function loadData() {
    try {
        const basePath = getBasePath();
        const [albumsResponse, singlesResponse, topTracksResponse] = await Promise.all([
            fetch(`${basePath}/data/albums.json`),
            fetch(`${basePath}/data/singles.json`),
            fetch(`${basePath}/data/top-tracks.json`)
        ]);

        if (!albumsResponse.ok || !singlesResponse.ok || !topTracksResponse.ok) {
            throw new Error('Ошибка загрузки данных');
        }

        const albumsData = await albumsResponse.json();
        const singlesData = await singlesResponse.json();
        const topTracksData = await topTracksResponse.json();

        albums = albumsData.albums;
        singles = singlesData.singles;
        topTracks = topTracksData.tracks;

        // Инициализация отображения после загрузки данных
        if (document.querySelector('#albums .swiper-wrapper')) {
            initAlbumCarousel();
        }
        if (singlesContainer) {
            displaySingles(singles);
        }
        if (topTracksContainer) {
            displayTopTracks();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showNotification('Ошибка загрузки данных');
    }
}

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);

// DOM элементы
const albumsContainer = document.getElementById('albums-container');
const singlesContainer = document.getElementById('singles-container');
const topTracksContainer = document.getElementById('top-tracks-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const albumModal = document.getElementById('album-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const ratingModal = document.getElementById('ratingModal');

// Создаем аудио плеер
const audioPlayer = new Audio();
let currentTrack = null;
let isPlaying = false;

// Функции для работы с рейтингами
function getRating(albumId) {
    return albumRatings[albumId] || null;
}

function setRating(albumId, ratings) {
    albumRatings[albumId] = ratings;
    localStorage.setItem('albumRatings', JSON.stringify(albumRatings));
}

function deleteRating(albumId) {
    if (albumRatings[albumId]) {
        delete albumRatings[albumId];
        localStorage.setItem('albumRatings', JSON.stringify(albumRatings));
    }
}

function getAverageRating(albumId) {
    const rating = getRating(albumId);
    if (!rating) return 0;
    const values = Object.values(rating);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// Функция для работы с темой
function applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    const themeIcon = themeToggleBtn.querySelector('.toggle-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

// Переключение темы
const themeIcon = themeToggleBtn.querySelector('.toggle-icon');
const body = document.body;
const navbar = document.querySelector('.navbar');

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
}

// Обновление иконки темы
function updateThemeIcon(theme) {
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});

// Функция для обновления средней оценки
function updateAverageRating() {
    const sliders = document.querySelectorAll('.rating__slider');
    const averageElement = document.querySelector('.rating__average-value');

    if (!sliders.length || !averageElement) return;

    let sum = 0;
    let count = 0;

    sliders.forEach(slider => {
        const value = parseInt(slider.value);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });

    const average = count > 0 ? Math.round(sum / count) : 0;
    averageElement.textContent = average;
}

// Функция для обновления значения слайдера
function updateSliderValue(slider) {
    const value = parseInt(slider.value);
    const valueDisplay = slider.parentElement.querySelector('.rating__value');
    const descriptionDisplay = slider.parentElement.querySelector('.rating__description');

    if (valueDisplay) {
        valueDisplay.textContent = value;
    }

    if (descriptionDisplay) {
        descriptionDisplay.textContent = getRatingDescription(value);
    }
}

// Функция для получения описания оценки
function getRatingDescription(value) {
    if (value >= 90) return 'Отличный';
    if (value >= 75) return 'Очень хороший';
    if (value >= 60) return 'Хороший';
    if (value >= 45) return 'Нормальный';
    if (value >= 30) return 'Плохой';
    if (value >= 15) return 'Очень плохой';
    return 'Ужасный';
}

// Функция для закрытия модального окна
function closeRatingModal() {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Функция для открытия модального окна
function openRatingModal(album) {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    // Устанавливаем данные альбома
    const albumCover = modal.querySelector('#modal-album-cover');
    const albumTitle = modal.querySelector('#modal-album-title');
    const albumYear = modal.querySelector('#modal-album-year');

    if (albumCover) albumCover.src = album.cover;
    if (albumTitle) albumTitle.textContent = album.title;
    if (albumYear) albumYear.textContent = album.year;

    // Загружаем сохраненные оценки
    const savedRatings = localStorage.getItem(`album_rating_${album.id}`);
    if (savedRatings) {
        const ratings = JSON.parse(savedRatings);
        const sliders = modal.querySelectorAll('.rating__slider');
        sliders.forEach(slider => {
            const criteria = slider.getAttribute('data-criteria');
            if (ratings[criteria]) {
                slider.value = ratings[criteria];
                updateSliderValue(slider);
            }
        });
    } else {
        // Сбрасываем слайдеры на значение по умолчанию
        const sliders = modal.querySelectorAll('.rating__slider');
        sliders.forEach(slider => {
            slider.value = 50;
            updateSliderValue(slider);
        });
    }

    // Обновляем среднюю оценку
    updateAverageRating();

    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Функция для инициализации обработчиков событий модального окна
function initRatingModal() {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    // Обработчик закрытия по крестику
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeRatingModal);
    }

    // Обработчик закрытия по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeRatingModal();
        }
    });

    // Обработчик отправки формы
    const submitBtn = modal.querySelector('.submit-rating');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const albumId = modal.dataset.albumId;
            if (!albumId) return;

            const ratings = {};
            const sliders = modal.querySelectorAll('.rating__slider');
            sliders.forEach(slider => {
                const criteria = slider.getAttribute('data-criteria');
                ratings[criteria] = parseInt(slider.value);
            });

            // Сохраняем рейтинг
            localStorage.setItem(`album_rating_${albumId}`, JSON.stringify(ratings));

            // Показываем уведомление
            showNotification('Оценка успешно сохранена');

            // Закрываем модальное окно
            setTimeout(() => {
                closeRatingModal();
            }, 1000);
        });
    }

    // Обработчик кнопки сброса
    const resetBtn = modal.querySelector('.reset-rating');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const sliders = modal.querySelectorAll('.rating__slider');
            sliders.forEach(slider => {
                slider.value = 50;
                updateSliderValue(slider);
            });
            updateAverageRating();
        });
    }

    // Обработчики слайдеров
    const sliders = modal.querySelectorAll('.rating__slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderValue(slider);
            updateAverageRating();
        });
    });
}

// Инициализация модального окна при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initRatingModal();
});

// Функция для отображения альбомов
function displayAlbums(albumsToDisplay) {
    albumsContainer.innerHTML = '';

    albumsToDisplay.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.className = 'album-card';
        albumCard.dataset.id = album.id;

        const formattedListens = formatListens(album.listens);

        albumCard.innerHTML = `
            <div class="album-img-container">
                <img class="album-img" src="${album.cover}" alt="${album.title}">
            </div>
            <div class="album-info">
                <h3 class="album-title">
                    <a href="#" class="album-link" data-album-id="${album.id}">${album.title}</a>
                </h3>
                <p class="album-artist">${album.artist}</p>
                <div class="album-meta">
                    <span>${album.year}</span>
                    <span>${formattedListens} прослушиваний</span>
                </div>
            </div>
        `;

        albumsContainer.appendChild(albumCard);

        // Добавляем обработчик для перехода на страницу альбома
        const albumLink = albumCard.querySelector('.album-link');
        if (albumLink) {
            albumLink.addEventListener('click', (e) => {
                e.preventDefault();
                const albumId = albumLink.dataset.albumId;
                loadAlbumData(albumId);
            });
        }

        // Добавляем обработчик для открытия модального окна при клике на карточку
        albumCard.addEventListener('click', (e) => {
            if (!e.target.closest('.album-link')) {
                openAlbumModal(album);
            }
        });
    });
}

// Функция для отображения синглов
function displaySingles(singlesToDisplay) {
    const singlesContainer = document.getElementById('singles-container');
    if (!singlesContainer) return;

    singlesContainer.innerHTML = '';

    singlesToDisplay.forEach(single => {
        const singleCard = document.createElement('div');
        singleCard.className = 'single-card';
        singleCard.dataset.id = single.id;

        const formattedListens = formatListens(single.listens);

        singleCard.innerHTML = `
            <div class="single-img-container">
                <img src="${single.cover}" alt="${single.title}">
            </div>
            <div class="single-info">
                <h3>
                    <a href="#" class="single-link" data-single-id="${single.id}">${single.title}</a>
                </h3>
                <p>${single.year}</p>
                <div class="single-meta">
                    <span>${formattedListens} прослушиваний</span>
                </div>
            </div>
        `;

        singlesContainer.appendChild(singleCard);

        // Добавляем обработчик для перехода на страницу сингла
        const singleLink = singleCard.querySelector('.single-link');
        if (singleLink) {
            singleLink.addEventListener('click', (e) => {
                e.preventDefault();
                const singleId = singleLink.dataset.singleId;
                loadSingleData(singleId);
            });
        }
    });
}

// Функция для отображения топ треков
function displayTopTracks() {
    const container = document.getElementById('top-tracks-container');
    if (!container) return;

    container.innerHTML = '';
    topTracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track-card';
        trackElement.innerHTML = `
            <div class="track-info">
                <h3 class="track-title">${track.title}</h3>
                <p class="track-album">${track.album}</p>
                <div class="track-meta">
                    <span class="track-duration">${track.duration}</span>
                    <span class="track-listens">${formatListens(track.listens)} прослушиваний</span>
                </div>
            </div>
            <button class="play-track-btn" data-audio="${track.audio}">
                <i class="fas fa-play"></i>
            </button>
        `;
        container.appendChild(trackElement);
    });

    // Добавляем обработчики для кнопок воспроизведения
    container.querySelectorAll('.play-track-btn').forEach(button => {
        button.addEventListener('click', () => {
            const audioUrl = button.dataset.audio;
            if (audioUrl) {
                // Здесь можно добавить логику воспроизведения
                console.log('Playing:', audioUrl);
            }
        });
    });
}

// Форматирование числа прослушиваний
function formatListens(listens) {
    if (listens >= 1000000) {
        return `${(listens / 1000000).toFixed(1)} млн`;
    } else if (listens >= 1000) {
        return `${(listens / 1000).toFixed(1)} тыс`;
    }
    return listens.toString();
}

// Функция для сортировки альбомов
function sortAlbums(albums, sortBy) {
    const sortedAlbums = [...albums];

    switch (sortBy) {
        case 'year-desc':
            sortedAlbums.sort((a, b) => b.year - a.year);
            break;
        case 'year-asc':
            sortedAlbums.sort((a, b) => a.year - b.year);
            break;
        case 'listens-desc':
            sortedAlbums.sort((a, b) => b.listens - a.listens);
            break;
        case 'listens-asc':
            sortedAlbums.sort((a, b) => a.listens - b.listens);
            break;
        default:
            break;
    }

    return sortedAlbums;
}

// Функция для фильтрации альбомов по поисковому запросу
function filterAlbums(albums, searchQuery) {
    if (!searchQuery) {
        return albums;
    }

    searchQuery = searchQuery.toLowerCase();

    return albums.filter(album => {
        return (
            album.title.toLowerCase().includes(searchQuery) ||
            album.year.toString().includes(searchQuery)
        );
    });
}

// Функция для обновления отображения альбомов
function updateAlbumsDisplay() {
    if (!albumsContainer) return;

    const searchQuery = searchInput ? searchInput.value.trim() : '';
    const sortBy = sortSelect ? sortSelect.value : 'year-desc';

    let filteredAlbums = filterAlbums(albums, searchQuery);
    let sortedAlbums = sortAlbums(filteredAlbums, sortBy);

    displayAlbums(sortedAlbums);

    // Отображаем синглы (без фильтрации, но с сортировкой)
    if (singlesContainer) {
        let sortedSingles = sortAlbums(singles, sortBy);
        displaySingles(sortedSingles);
    }
}

// Функция для открытия модального окна с информацией об альбоме
function openAlbumModal(album) {
    // Заполняем информацию в модальном окне
    document.getElementById('modal-album-title').textContent = album.title;
    document.getElementById('modal-album-img').src = album.cover;
    document.getElementById('modal-album-artist').textContent = album.artist;
    document.getElementById('modal-album-year').textContent = album.year;
    document.getElementById('modal-album-listens').textContent = formatListens(album.listens);

    // Заполняем список треков
    const tracksContainer = document.getElementById('modal-album-tracks');
    tracksContainer.innerHTML = '<h3>Список треков:</h3>';

    const trackList = document.createElement('ul');
    trackList.className = 'track-list';

    album.tracks.forEach(track => {
        const trackItem = document.createElement('li');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
      <span class="track-number">${track.number}.</span>
      <span class="track-title">${track.title}</span>
      <span class="track-duration">${track.duration}</span>
    `;
        trackList.appendChild(trackItem);
    });

    tracksContainer.appendChild(trackList);

    // Показываем модальное окно
    albumModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
}

// Функция для закрытия модального окна
function closeAlbumModal() {
    albumModal.classList.remove('active');
    document.body.style.overflow = ''; // Разрешаем прокрутку страницы
}

// Функции для страницы альбома
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        type: params.get('type') // 'album' или 'single'
    };
}

function displayAlbumData(album) {
    document.title = `${album.title} - КУОК`;
    const coverElement = document.getElementById('album-cover');
    const titleElement = document.getElementById('album-title');
    const artistElement = document.getElementById('album-artist');
    const yearElement = document.getElementById('album-year');
    const listensElement = document.getElementById('album-listens');
    const tracksListElement = document.getElementById('tracks-list');

    if (!coverElement || !titleElement || !artistElement || !yearElement || !listensElement || !tracksListElement) {
        return; // Не на странице альбома
    }

    coverElement.src = album.cover;
    titleElement.textContent = album.title;
    artistElement.textContent = album.artist;
    yearElement.textContent = album.year;
    listensElement.textContent = `${formatListens(album.listens)} прослушиваний`;

    tracksListElement.innerHTML = '';

    if (album.tracks) {
        album.tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.innerHTML = `
                <div class="track-position">
                    <span class="position-number">${track.number}</span>
                </div>
                <div class="track-info">
                    <h4 class="track-title">${track.title}</h4>
                </div>
                <div class="track-duration">
                    <i class="fas fa-clock"></i>
                    <span>${track.duration}</span>
                </div>
            `;
            tracksListElement.appendChild(trackElement);
        });
    } else {
        // Для синглов отображаем только одну дорожку
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <div class="track-position">
                <span class="position-number">1</span>
            </div>
            <div class="track-info">
                <h4 class="track-title">${album.title}</h4>
            </div>
            <div class="track-duration">
                <i class="fas fa-clock"></i>
                <span>${album.duration}</span>
            </div>
        `;
        tracksListElement.appendChild(trackElement);
    }
}

// Загрузка данных для страницы альбома
async function loadAlbumPageData() {
    const params = getUrlParams();
    if (!params.id || !params.type) {
        return;
    }

    try {
        const response = await fetch(`../../data/${params.type}s.json`);
        if (!response.ok) {
            throw new Error('Failed to load data');
        }

        const data = await response.json();
        const items = data[`${params.type}s`];
        const item = items.find(item => item.id === params.id);

        if (item) {
            displayAlbumData(item);
        } else {
            console.error('Item not found:', params.id);
            window.location.href = '../../index.html';
        }
    } catch (error) {
        console.error('Error loading data:', error);
        window.location.href = '../../index.html';
    }
}

// Функции для страницы рейтингов
function initMap() {
    if (typeof ymaps === 'undefined' || !document.getElementById('map')) {
        return;
    }

    ymaps.ready(() => {
        // Создание карты
        var myMap = new ymaps.Map("map", {
            center: [52.275113, 104.279649], // Координаты центра карты (Иркутск)
            zoom: 12 // Масштаб
        });

        // Добавление метки
        var myPlacemark = new ymaps.Placemark([52.275113, 104.279649], {
            hintContent: 'КУОК',
            balloonContent: 'Здесь можно найти автора'
        });

        // Добавление метки на карту
        myMap.geoObjects.add(myPlacemark);
    });
}

function initRatingsPage() {
    const selectAlbumBtn = document.getElementById('selectAlbumBtn');
    const albumSelectionModal = document.getElementById('albumSelectionModal');
    const ratingModal = document.getElementById('ratingModal');
    const albumsGrid = document.getElementById('albumsGrid');
    const closeButtons = document.querySelectorAll('.modal__close');
    const ratingSliders = document.querySelectorAll('.rating-slider');
    const sliderValues = document.querySelectorAll('.slider-value');
    const resetRatingsBtn = document.getElementById('resetRatings');
    const submitRatingBtn = document.getElementById('submitRating');

    if (!selectAlbumBtn) return;

    // Открытие модального окна выбора альбома
    selectAlbumBtn.addEventListener('click', () => {
        albumSelectionModal.style.display = 'block';
        loadAlbumsForSelection();
    });

    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            albumSelectionModal.style.display = 'none';
            ratingModal.style.display = 'none';
        });
    });

    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === albumSelectionModal) {
            albumSelectionModal.style.display = 'none';
        }
        if (e.target === ratingModal) {
            ratingModal.style.display = 'none';
        }
    });

    // Загрузка альбомов для выбора
    async function loadAlbumsForSelection() {
        try {
            const response = await fetch('../../data/albums.json');
            const albums = await response.json();

            albumsGrid.innerHTML = '';
            albums.forEach(album => {
                const albumCard = document.createElement('div');
                albumCard.className = 'album-card';
                albumCard.innerHTML = `
                    <img src="${album.cover}" alt="${album.title}">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                `;
                albumCard.addEventListener('click', () => selectAlbum(album));
                albumsGrid.appendChild(albumCard);
            });
        } catch (error) {
            console.error('Ошибка загрузки альбомов:', error);
            showNotification('Ошибка загрузки альбомов', 'error');
        }
    }

    // Выбор альбома для оценки
    function selectAlbum(album) {
        albumSelectionModal.style.display = 'none';
        ratingModal.style.display = 'block';

        document.getElementById('selectedAlbumCover').src = album.cover;
        document.getElementById('selectedAlbumTitle').textContent = album.title;
        document.getElementById('selectedAlbumArtist').textContent = album.artist;

        // Загрузка сохраненных оценок
        const savedRatings = JSON.parse(localStorage.getItem(`ratings_${album.id}`)) || {};
        ratingSliders.forEach(slider => {
            const criteria = slider.dataset.criteria;
            const value = savedRatings[criteria] || 50;
            slider.value = value;
            slider.nextElementSibling.textContent = value;
        });
    }

    // Обновление значений слайдеров
    ratingSliders.forEach(slider => {
        slider.addEventListener('input', () => {
            const value = slider.value;
            slider.nextElementSibling.textContent = value;
        });
    });

    // Сброс оценок
    resetRatingsBtn.addEventListener('click', () => {
        ratingSliders.forEach(slider => {
            slider.value = 50;
            slider.nextElementSibling.textContent = '50';
        });
    });

    // Сохранение оценок
    submitRatingBtn.addEventListener('click', () => {
        const albumTitle = document.getElementById('selectedAlbumTitle').textContent;
        const ratings = {};

        ratingSliders.forEach(slider => {
            const criteria = slider.dataset.criteria;
            ratings[criteria] = parseInt(slider.value);
        });

        // Сохранение в localStorage
        const albumId = albumTitle.toLowerCase().replace(/\s+/g, '_');
        localStorage.setItem(`ratings_${albumId}`, JSON.stringify(ratings));

        // Обновление отображения средних оценок
        updateAverageRatings();

        // Закрытие модального окна
        ratingModal.style.display = 'none';
        showNotification('Оценки сохранены', 'success');
    });

    // Обновление средних оценок
    function updateAverageRatings() {
        const criteriaItems = document.querySelectorAll('.criteria-item');
        const allRatings = {};

        // Сбор всех оценок
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('ratings_')) {
                const ratings = JSON.parse(localStorage.getItem(key));
                Object.entries(ratings).forEach(([criteria, value]) => {
                    if (!allRatings[criteria]) {
                        allRatings[criteria] = [];
                    }
                    allRatings[criteria].push(value);
                });
            }
        }

        // Расчет и отображение средних значений
        criteriaItems.forEach(item => {
            const criteria = item.querySelector('h3').textContent.toLowerCase();
            const valueElement = item.querySelector('.rating-value');

            if (allRatings[criteria]) {
                const average = Math.round(
                    allRatings[criteria].reduce((a, b) => a + b, 0) / allRatings[criteria].length
                );
                valueElement.textContent = average;
            } else {
                valueElement.textContent = '0';
            }
        });
    }

    // Инициализация при загрузке страницы
    updateAverageRatings();
}

// Инициализация страницы рейтингов при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initRatingsPage();
});

// Обработчики событий
if (searchInput) {
    searchInput.addEventListener('input', updateAlbumsDisplay);
}
if (sortSelect) {
    sortSelect.addEventListener('change', updateAlbumsDisplay);
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAlbumModal);
}

// Закрытие модального окна при клике вне него
if (albumModal) {
    albumModal.addEventListener('click', (e) => {
        if (e.target === albumModal) {
            closeAlbumModal();
        }
    });
}

// Закрытие модального окна при нажатии клавиши Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && albumModal && albumModal.classList.contains('active')) {
        closeAlbumModal();
    }
});

// Плавная прокрутка к разделам
const navLinks = document.querySelectorAll('.nav-links a');
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Если ссылка без хэша (главная страница)
            if (!href.includes('#')) {
                return; // Позволяем стандартному переходу по ссылке
            }

            e.preventDefault();
            const targetId = href.substring(href.indexOf('#') + 1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Отслеживание активной секции при прокрутке
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        if (window.pageYOffset >= (sectionTop - navbarHeight - 100)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Добавляем обработчик прокрутки
window.addEventListener('scroll', () => {
    updateActiveSection();

    // Анимация навигации при прокрутке
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('animate');
        } else {
            navbar.classList.remove('animate');
        }
    }
});

// Инициализация карусели альбомов только если она существует
const albumSwiper = document.querySelector('.album-carousel') ? new Swiper('.album-carousel', {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
}) : null;

// Обработка клавиатурной навигации для карусели
if (albumSwiper) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            albumSwiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            albumSwiper.slideNext();
        }
    });
}

// Добавление стилей для уведомления
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 1.7s forwards;
        z-index: 2000;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Функция для показа уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Анимация появления секций при прокрутке
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за всеми секциями
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Плавная прокрутка колесиком мыши
let isScrolling = false;
let scrollTimeout;

window.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    isScrolling = true;
    clearTimeout(scrollTimeout);

    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentScroll = window.pageYOffset;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    // Определяем направление прокрутки
    const direction = e.deltaY > 0 ? 1 : -1;

    // Находим текущую секцию
    let currentSectionIndex = sections.findIndex(section => {
        const sectionTop = section.offsetTop - navbarHeight;
        const sectionBottom = sectionTop + section.offsetHeight;
        return currentScroll >= sectionTop && currentScroll < sectionBottom;
    });

    // Вычисляем индекс следующей секции
    let nextSectionIndex = currentSectionIndex + direction;

    // Проверяем границы
    if (nextSectionIndex < 0) nextSectionIndex = 0;
    if (nextSectionIndex >= sections.length) nextSectionIndex = sections.length - 1;

    // Прокручиваем к следующей секции
    const targetSection = sections[nextSectionIndex];
    const targetPosition = targetSection.offsetTop - navbarHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });

    // Сбрасываем флаг прокрутки через 1000мс
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 1000);
});

// Функции для работы с альбомами
function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.dataset.album = album.id;

    card.innerHTML = `
        <div class="album-img-container">
            <img src="${album.cover}" alt="${album.title}">
        </div>
        <div class="album-info">
            <h3><a href="/pages/albums/album.html?id=${album.id}&type=album">${album.title}</a></h3>
            <p>${album.year}</p>
            <button class="rate-album-btn" data-album-id="${album.id}">Оценить альбом</button>
        </div>
    `;

    return card;
}

function displayAlbumDetails(album, container) {
    const albumHeader = document.createElement('div');
    albumHeader.className = 'album-header';
    albumHeader.innerHTML = `
        <div class="album-cover-large">
            <img src="${album.cover}" alt="${album.title}">
        </div>
        <div class="album-info-large">
            <h1>${album.title}</h1>
            <p>${album.artist}</p>
            <div class="album-meta-large">
                <span>${album.year}</span>
            </div>
        </div>
    `;
    container.appendChild(albumHeader);

    // Отображение списка треков
    if (album.tracks && album.tracks.length > 0) {
        const tracksList = document.createElement('div');
        tracksList.className = 'tracks-list';

        album.tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.innerHTML = `
                <div class="track-position">
                    <span class="position-number">${track.number}</span>
                </div>
                <div class="track-info">
                    <h4 class="track-title">${track.title}</h4>
                </div>
                <div class="track-duration">
                    <i class="fas fa-clock"></i>
                    <span>${track.duration}</span>
                </div>
            `;
            tracksList.appendChild(trackElement);
        });

        container.appendChild(tracksList);
    }
}

// Функции для работы с артистом
function displayArtistProfile(container) {
    const artistData = {
        name: 'КУОК',
        bio: 'КУОК — российский музыкальный исполнитель, известный своим уникальным стилем, сочетающим элементы хип-хопа, электроники и альтернативной музыки. За свою карьеру выпустил несколько успешных альбомов и синглов, собирая миллионы прослушиваний на стриминговых платформах.',
        imageUrl: 'https://sun9-64.userapi.com/impg/dN5293VfkS0vqqtcydxRbV5o6xY9BR_EJGLp-A/paTTm9ePDd8.jpg?size=604x604&quality=95&sign=cd4e58ba71f9cc1766a20bf7934a5faa&type=album'
    };

    const artistCard = container.querySelector('.artist-card');
    if (!artistCard) return;

    const img = artistCard.querySelector('.artist-img');
    const name = artistCard.querySelector('.artist-name');
    const bio = artistCard.querySelector('.artist-bio');

    if (img) img.src = artistData.imageUrl;
    if (name) name.textContent = artistData.name;
    if (bio) bio.textContent = artistData.bio;
}

// Функция для инициализации карусели альбомов
function initAlbumCarousel() {
    const albumsSection = document.querySelector('#albums .swiper-wrapper');
    if (!albumsSection) return;

    // Очищаем контейнер перед добавлением слайдов
    albumsSection.innerHTML = '';

    // Добавляем слайды
    albums.forEach(album => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="album-card" data-album="${album.id}">
                <div class="album-img-container">
                    <img src="${album.cover}" alt="${album.title}">
                </div>
                <div class="album-info">
                    <h3>
                        <a href="${getBasePath()}/pages/albums/album.html?id=${album.id}&type=album">${album.title}</a>
                    </h3>
                    <p>${album.year}</p>
                    <button class="rate-album-btn" data-album-id="${album.id}">Оценить альбом</button>
                </div>
            </div>
        `;
        albumsSection.appendChild(slide);

        // Добавляем обработчик для кнопки оценки
        const rateButton = slide.querySelector('.rate-album-btn');
        if (rateButton) {
            rateButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const albumId = rateButton.dataset.albumId;
                const album = albums.find(a => a.id === albumId);
                if (album) {
                    openRatingModal(album);
                }
            });
        }

        // Добавляем обработчик для перехода на страницу альбома
        const albumLink = slide.querySelector('a');
        if (albumLink) {
            albumLink.addEventListener('click', (e) => {
                e.preventDefault();
                const albumId = album.id;
                loadAlbumData(albumId);
            });
        }
    });

    // Инициализация Swiper
    new Swiper('#albums .swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        speed: 800,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                centeredSlides: false
            },
            768: {
                slidesPerView: 3,
                centeredSlides: false
            },
            1024: {
                slidesPerView: 4,
                centeredSlides: false
            }
        }
    });
}

// Функция для загрузки данных альбома
async function loadAlbumData(albumId) {
    try {
        const basePath = getBasePath();
        const response = await fetch(`${basePath}/data/albums.json`);
        if (!response.ok) {
            throw new Error('Failed to load album data');
        }
        const data = await response.json();
        const album = data.albums.find(a => a.id === albumId);

        if (album) {
            // Сохраняем данные альбома в localStorage для использования на странице альбома
            localStorage.setItem('currentAlbum', JSON.stringify(album));
            // Переходим на страницу альбома
            window.location.href = `${basePath}/pages/albums/album.html?id=${albumId}&type=album`;
        } else {
            showNotification('Альбом не найден');
        }
    } catch (error) {
        console.error('Error loading album data:', error);
        showNotification('Ошибка загрузки данных альбома');
    }
}

// Функция для загрузки данных сингла
async function loadSingleData(singleId) {
    try {
        const basePath = getBasePath();
        const response = await fetch(`${basePath}/data/singles.json`);
        if (!response.ok) {
            throw new Error('Failed to load single data');
        }
        const data = await response.json();
        const single = data.singles.find(s => s.id === singleId);

        if (single) {
            // Сохраняем данные сингла в localStorage для использования на странице сингла
            localStorage.setItem('currentSingle', JSON.stringify(single));
            // Переходим на страницу сингла
            window.location.href = `${basePath}/pages/singles/single.html?id=${singleId}&type=single`;
        } else {
            showNotification('Сингл не найден');
        }
    } catch (error) {
        console.error('Error loading single data:', error);
        showNotification('Ошибка загрузки данных сингла');
    }
}