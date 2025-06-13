// Імпорти бібліотек
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// *** Константи та елементи DOM ***
const API_KEY = '50828964-E021381452EC656DE38C2C47D'; // <-- Заміни на свій реальний ключ Pixabay
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.form');
const searchInput = searchForm.elements['search-text'];
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let lightbox; // Змінна для зберігання екземпляра SimpleLightbox

// *** Функції для HTTP-запитів (раніше в pixabay-api.js) ***
async function getImagesByQuery(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: "rose",
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images from Pixabay. Please try again later.');
  }
}

// *** Функції для відображення елементів інтерфейсу (раніше в render-functions.js) ***
function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="image-info">
        <div class="info-item">
          <p><b>Likes</b></p>
          <p>${likes}</p>
        </div>
        <div class="info-item">
          <p><b>Views</b></p>
          <p>${views}</p>
        </div>
        <div class="info-item">
          <p><b>Comments</b></p>
          <p>${comments}</p>
        </div>
        <div class="info-item">
          <p><b>Downloads</b></p>
          <p>${downloads}</p>
        </div>
      </div>
    </li>
  `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  // Ініціалізуємо SimpleLightbox лише один раз або оновлюємо його
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      animationSpeed: 150,
    });
  } else {
    lightbox.refresh();
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoader() {
  loader.classList.add('is-visible');
}

function hideLoader() {
  loader.classList.remove('is-visible');
}

// *** Основна логіка роботи додатка (раніше в main.js) ***
searchForm.addEventListener('submit', onSearchSubmit);

async function onSearchSubmit(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Search field cannot be empty!',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 3000,
      });
    } else {
      createGallery(data.hits);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
      timeout: 5000,
    });
  } finally {
    hideLoader();
    searchForm.reset();
  }
}
