'use strict';
import Notiflix from 'notiflix';                                    //import bibliotek i styli
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api';

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
    loadImages(searchQuestion, page, buttonLoadMore);
});

async function loadImages(query, page, buttonLoadMore) {                    // funkcja ładowania obrazków
    const perPage = 40;                                                      // ilość na stronie
    const data = await fetchImages(query, page, buttonLoadMore, perPage);    // wywołanie fuunkcji fetchImages do pobrania danych obrazków
        if (data=== null) {                                                  // jeśli brak wyników to funkcja jest przerywana 
            return;
        }
//przetwarzanie danych zwróconych przez fechImage (dane wstawiane są do html)
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
        
        //przygotowanie kodu html dla obrazków i ich danych
    
        gallery.insertAdjacentHTML('beforeend', images.join(''));          //dodanie do kontenera obrazków na końcu , jako kolejne
        lightbox.refresh();                                                               // odświeżenie działania lightbox'a
    
        if (data.totalHits <= page * perPage) {
            buttonLoadMore.style.display = 'none';                                       //jęsli to ostatnia strona obrazków  - ukrycie przycisku load more
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            buttonLoadMore.style.display = 'block';                                     // ...a jeśli nie to pokazanie tego przycisku
        } 
    }


buttonLoadMore.addEventListener('click', () => {                          //nasłuch na 'load more'
    page++;
    loadImages(searchQuestion, page, buttonLoadMore);                              //wywołanie funkcji pobrania kolejnej strony
});

