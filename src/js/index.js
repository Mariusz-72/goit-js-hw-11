'use strict';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39862890-65ac2b6f59b7905db114a6f69';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuestion = '';

buttonLoadMore.style.display = 'none';

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    searchQuestion = event.target.elements.searchQuery.value;
    fetchImages(searchQuestion, page);
});

async function fetchImages(query, page) {
    const perPage = 40;
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
 
    try {
        const response = await axios.get(url);
        const { data } = response;

        if (data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching ypur search query. Please try again.");
            buttonLoadMore.style.display = 'none';
            return;
        }

        const images = data.hits.map((image) => `
        <a href = "${image.largeImageURL}" class="photo-card" target="_blank" >
    <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes</b> ${image.likes}
            </p>
            <p class="info-item"><b>Views</b> ${image.views}
            </p>
            <p class="info-item"><b>Comments</b> ${image.comments}
            </p>
            <p class="info-item"><b>Downloads</b> ${image.downloads}
            </p>
        </div>
        </a>
        `);
    
        gallery.insertAdjacentHTML('beforeend', images.join(''));
        lightbox.refresh();
    
        if (data.totalHits <= page * perPage) {
            buttonLoadMore.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            buttonLoadMore.style.display = 'block';
        }
    } catch (error) {
        Notiflix.Notify.failure("Oops! Something went wrong. Please try again.");
    }
}
 
buttonLoadMore.addEventListener('click', () => {
  page++;
  fetchImages(searchQuestion, page);
});

