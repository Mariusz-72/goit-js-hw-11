import axios from 'axios';
import Notiflix from 'notiflix';
const apiKey = '39862890-65ac2b6f59b7905db114a6f69';                         // klucz API do serwisu pixabay

async function fetchImages(query, page, buttonLoadMore, perPage) {                  //asynchroniczna funkcja do pobierania obrazków
    //const perPage = 40;                                                   // ile obrazków na stronę
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {                                                                  // wysłanie zapytania do serwera
        const response = await axios.get(url);
        const { data } = response;
        if (data.totalHits === 0) {                                          // wyświetlanie komunikatu jeśli brak obrazków do zadanego pytania
            Notiflix.Notify.failure("Sorry, there are no images matching ypur search query. Please try again.");
            buttonLoadMore.style.display = 'none';                              // ukrycie przycisku do ładowania kolejnych obrazków  - skoro ich brak
            return null;
        }
        
        return data;                                                          //zwrot danych do index.js

    } catch (error) {                                                         // obsługa błędu
        Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
        return null;
    }
}


export default  fetchImages ;