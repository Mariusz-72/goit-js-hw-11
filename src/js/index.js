'use strict';
import Notiflix from 'notiflix';                                    //import bibliotek i styli
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '39862890-65ac2b6f59b7905db114a6f69';                         // klucz API do serwisu pixabay

const searchForm = document.querySelector('#search-form');            // wybór elementów z html'a
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');                     // inicjalizacja lightboxa

let page = 1;                                                         // zmienna dla aktualnej strony wyników
let searchQuestion = '';                                           // zmienna do przechowywania aktualnego zapytania

buttonLoadMore.style.display = 'none';                                // na początku przycisk load more  - wyłączony

searchForm.addEventListener('submit', async (event) => {    //nasłuch na submit w formularzu
    event.preventDefault();                                               // wyczyszczenie poprzednich wyników i zresetowanie strony
    gallery.innerHTML = '';
    page = 1;
    searchQuestion = event.target.elements.searchQuery.value;              //pobranie zapytania 
    fetchImages(searchQuestion, page);                            // uruchomienie funkcji do pobrania obrazków z pixabay
});

async function fetchImages(query, page) {                  //asynchroniczna funkcja do pobierania obrazków
    const perPage = 40;                                                   // ile obrazków na stronę
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {                                                                  // wysłanie zapytania do serwera
        const response = await axios.get(url);
        const { data } = response;
        if (data.totalHits === 0) {                                          // wyświetlanie komunikatu jeśli brak obrazków do zadanego pytania
            Notiflix.Notify.failure("Sorry, there are no images matching ypur search query. Please try again.");
            buttonLoadMore.style.display = 'none';                              // ukrycie przycisku do ładowania kolejnych obrazków  - skoro ich brak
            return;
        }
                                                                                //przygotowanie kodu html dla obrazków i ich danych
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
    
        gallery.insertAdjacentHTML('beforeend', images.join(''));               //dodanie do kontenera obrazków
        lightbox.refresh();                                                               // odświeżenie działania lightbox'a
    
        if (data.totalHits <= page * perPage) {
            buttonLoadMore.style.display = 'none';                                    //jęsli to ostatnia strona obrazków  - ukrycie przycisku load more
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            buttonLoadMore.style.display = 'block';                                     // ...a jeśłi nie to pokazanie tego przycisku
        }
    } catch (error) {
        Notiflix.Notify.failure("Oops! Something went wrong. Please try again.");          // obsługa błędu
    }
}

buttonLoadMore.addEventListener('click', () => {                          //nasłuch na 'load more'
    page++;
    fetchImages(searchQuestion, page);                                       //wywołanie funkcji pobrania kiolejnej strony
});

