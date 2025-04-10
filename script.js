
// Данные альбомов
const albums = [
  {
    id: 1,
    title: "IMAGO",
    artist: "КУОК",
    year: 2022,
    listens: 4250000,
    cover: "https://avatars.mds.yandex.net/i?id=b568cd0307fd7fc0afae69f2fa1ee7cf21f91606-7012645-images-thumbs&n=13",
    tracks: [
      { number: 1, title: "Вступление", duration: "1:15" },
      { number: 2, title: "Неоновые огни", duration: "3:42" },
      { number: 3, title: "Ночной проспект", duration: "4:21" },
      { number: 4, title: "Дождь и асфальт", duration: "3:56" },
      { number: 5, title: "Последний трамвай", duration: "5:10" }
    ]
  },
  {
    id: 2,
    title: "КРАСНОСТЬ",
    artist: "КУОК",
    year: 2020,
    listens: 3180000,
    cover: "https://avatars.mds.yandex.net/i?id=bcfeaeec22061eae76478b1adc69234490655814-5310620-images-thumbs&n=13",
    tracks: [
      { number: 1, title: "Старт", duration: "2:30" },
      { number: 2, title: "Невесомость", duration: "4:15" },
      { number: 3, title: "Далекие планеты", duration: "3:48" },
      { number: 4, title: "Космическая пыль", duration: "5:22" },
      { number: 5, title: "Возвращение", duration: "4:04" }
    ]
  },
  {
    id: 3,
    title: "ДЖАНГЛ",
    artist: "КУОК",
    year: 2018,
    listens: 2750000,
    cover: "https://avatars.mds.yandex.net/i?id=b57112c1cec300cb1d87f3345fca751197e5203c-4709556-images-thumbs&n=13",
    tracks: [
      { number: 1, title: "Подключение", duration: "2:10" },
      { number: 2, title: "Цифровой код", duration: "3:45" },
      { number: 3, title: "Виртуальная реальность", duration: "4:12" },
      { number: 4, title: "Данные", duration: "3:30" },
      { number: 5, title: "Отключение", duration: "2:55" }
    ]
  },
  {
    id: 4,
    title: "DECADANCE 2",
    artist: "КУОК",
    year: 2016,
    listens: 1980000,
    cover: "https://avatars.mds.yandex.net/i?id=3e81566dce9968b953d62922b55990df105f15d7-5225010-images-thumbs&n=13",
    tracks: [
      { number: 1, title: "Начало пути", duration: "3:15" },
      { number: 2, title: "Первый опыт", duration: "4:05" },
      { number: 3, title: "Ошибки и уроки", duration: "3:48" },
      { number: 4, title: "Прогресс", duration: "4:22" },
      { number: 5, title: "Новые горизонты", duration: "3:56" }
    ]
  },
  {
    id: 5,
    title: "AD/HD 1725",
    artist: "КУОК",
    year: 2015,
    listens: 1560000,
    cover: "https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F790b78c1d819d3978ccbcca22426fc62.1000x1000x1.png",
    tracks: [
      { number: 1, title: "Детство", duration: "3:40" },
      { number: 2, title: "Школьные годы", duration: "3:25" },
      { number: 3, title: "Первая любовь", duration: "4:12" },
      { number: 4, title: "Взросление", duration: "3:58" },
      { number: 5, title: "Настоящее", duration: "4:05" }
    ]
  }
];

// Данные синглов
const singles = [
  {
    id: 101,
    title: "Летний дождь",
    artist: "КУОК",
    year: 2023,
    listens: 980000,
    cover: "https://raw.githubusercontent.com/gptengineer-ai/gptengineer-images/main/photo-1649972904349-6e44c42644a7.webp",
    tracks: [
      { number: 1, title: "Летний дождь", duration: "3:25" }
    ]
  },
  {
    id: 102,
    title: "Высокие скорости",
    artist: "КУОК",
    year: 2022,
    listens: 850000,
    cover: "https://raw.githubusercontent.com/gptengineer-ai/gptengineer-images/main/photo-1519389950473-47ba0277781c.webp",
    tracks: [
      { number: 1, title: "Высокие скорости", duration: "3:18" }
    ]
  },
  {
    id: 103,
    title: "Новый день",
    artist: "КУОК",
    year: 2021,
    listens: 720000,
    cover: "https://raw.githubusercontent.com/gptengineer-ai/gptengineer-images/main/photo-1581091226825-a6a2a5aee158.webp",
    tracks: [
      { number: 1, title: "Новый день", duration: "4:05" }
    ]
  },
  {
    id: 104,
    title: "Звездопад",
    artist: "КУОК",
    year: 2020,
    listens: 650000,
    cover: "https://raw.githubusercontent.com/gptengineer-ai/gptengineer-images/main/photo-1486312338219-ce68d2c6f44d.webp",
    tracks: [
      { number: 1, title: "Звездопад", duration: "3:42" }
    ]
  }
];

// Данные для топ треков
const topTracks = [
  {
    id: 1,
    title: "РУКИ ТЯНУТСЯ",
    album: "сингл",
    listens: 1250000,
    duration: "2:41"
  },
  {
    id: 2,
    title: "ПУЛЬС",
    album: "СПОРТ РЕЖИМ:КРАСНЫЙ СВЕТ",
    listens: 980000,
    duration: "3:29"
  },
  {
    id: 3,
    title: "Ножевое",
    album: "IMAGO",
    listens: 850000,
    duration: "2:50"
  },
  {
    id: 4,
    title: "Дорогое развлечение",
    album: "КРАСНОСТЬ",
    listens: 820000,
    duration: "3:34"
  },
  {
    id: 5,
    title: "Далеко и надолго",
    album: "IMAGO",
    listens: 720000,
    duration: "3:50"
  }
];

// DOM элементы
const albumsContainer = document.getElementById('albums-container');
const singlesContainer = document.getElementById('singles-container');
const topTracksContainer = document.getElementById('top-tracks-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const albumModal = document.getElementById('album-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Функция для отображения альбомов
function displayAlbums(albumsToDisplay) {
  albumsContainer.innerHTML = '';
  
  albumsToDisplay.forEach(album => {
    const albumCard = document.createElement('div');
    albumCard.className = 'album-card';
    albumCard.dataset.id = album.id;
    
    // Форматирование количества прослушиваний
    const formattedListens = formatListens(album.listens);
    
    albumCard.innerHTML = `
      <div class="album-img-container">
        <img class="album-img" src="${album.cover}" alt="${album.title}">
      </div>
      <div class="album-info">
        <h3 class="album-title">${album.title}</h3>
        <p class="album-artist">${album.artist}</p>
        <div class="album-meta">
          <span>${album.year}</span>
          <span>${formattedListens} прослушиваний</span>
        </div>
      </div>
    `;
    
    albumsContainer.appendChild(albumCard);
    
    // Добавляем обработчик события для открытия модального окна
    albumCard.addEventListener('click', () => {
      openAlbumModal(album);
    });
  });
}

// Функция для отображения синглов
function displaySingles(singlesToDisplay) {
  singlesContainer.innerHTML = '';
  
  singlesToDisplay.forEach(single => {
    const singleCard = document.createElement('div');
    singleCard.className = 'single-card';
    singleCard.dataset.id = single.id;
    
    // Форматирование количества прослушиваний
    const formattedListens = formatListens(single.listens);
    
    singleCard.innerHTML = `
      <span class="single-badge">Сингл</span>
      <div class="single-img-container">
        <img class="single-img" src="${single.cover}" alt="${single.title}">
      </div>
      <div class="single-info">
        <h3 class="single-title">${single.title}</h3>
        <p class="single-artist">${single.artist}</p>
        <div class="single-meta">
          <span>${single.year}</span>
          <span>${formattedListens} прослушиваний</span>
        </div>
      </div>
    `;
    
    singlesContainer.appendChild(singleCard);
    
    // Добавляем обработчик события для открытия модального окна
    singleCard.addEventListener('click', () => {
      openAlbumModal(single);
    });
  });
}

// Функция для отображения топ треков
function displayTopTracks() {
  topTracksContainer.innerHTML = '';
  
  topTracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item-top';
    
    // Форматирование количества прослушиваний
    const formattedListens = formatListens(track.listens);
    
    trackItem.innerHTML = `
      <div class="track-position">${index + 1}</div>
      <div class="track-info">
        <h4 class="track-title-top">${track.title}</h4>
        <p class="track-album">${track.album}</p>
      </div>
      <div class="track-listens">${formattedListens} прослушиваний</div>
      <div class="track-duration">${track.duration}</div>
    `;
    
    topTracksContainer.appendChild(trackItem);
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
  const searchQuery = searchInput.value.trim();
  const sortBy = sortSelect.value;
  
  let filteredAlbums = filterAlbums(albums, searchQuery);
  let sortedAlbums = sortAlbums(filteredAlbums, sortBy);
  
  displayAlbums(sortedAlbums);
  
  // Отображаем синглы (без фильтрации, но с сортировкой)
  let sortedSingles = sortAlbums(singles, sortBy);
  displaySingles(sortedSingles);
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

// Переключение темы
function toggleTheme() {
  const body = document.body;
  const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    toggleIcon.textContent = '🌙'; // Иконка луны для переключения на темную тему
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    toggleIcon.textContent = '☀️'; // Иконка солнца для переключения на светлую тему
    localStorage.setItem('theme', 'dark');
  }
}

// Загрузка сохраненной темы из localStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeToggleBtn.querySelector('.toggle-icon').textContent = '☀️';
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeToggleBtn.querySelector('.toggle-icon').textContent = '🌙';
  }
}

// Обработчики событий
searchInput.addEventListener('input', updateAlbumsDisplay);
sortSelect.addEventListener('change', updateAlbumsDisplay);
themeToggleBtn.addEventListener('click', toggleTheme);
closeModalBtn.addEventListener('click', closeAlbumModal);

// Закрытие модального окна при клике вне него
albumModal.addEventListener('click', (e) => {
  if (e.target === albumModal) {
    closeAlbumModal();
  }
});

// Закрытие модального окна при нажатии клавиши Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && albumModal.classList.contains('active')) {
    closeAlbumModal();
  }
});

// Плавная прокрутка к разделам при клике на ссылки в навбаре
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: offsetTop - 80, // с учетом высоты навбара
        behavior: 'smooth'
      });
    }
  });
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  displayTopTracks();
  updateAlbumsDisplay();
});
