import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let lightbox;

export function createGallery(images) {
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

  // Initialize SimpleLightbox only once
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh(); // Refresh if already initialized
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('is-visible');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
}
