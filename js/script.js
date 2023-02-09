const API_KEY = '05b70378-7e07-4f73-8ee4-a9b0676d6a4a'
const API_KEY_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_SEARCH_URL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='

const form = document.querySelector('form')
const search = document.querySelector('.header__search')

getMovies(API_KEY_POPULAR)

async function getMovies(url){
    const resp = await fetch(url, {
        headers:{
            "Content-type": "application/json",
            "X-API-KEY": API_KEY
        },

    })
    const respData = await resp.json()
    showMovies(respData)
}


function movieRatingCount(mark){
  if(mark >= 7){
    return 'green'
  }
  else if(mark > 5){
    return 'orange'
  }
  else if(mark.includes('%')){
    return 'vio'
  }
  else{
    return 'red'
  }

}

function showMovies(data){
    const moviesEl = document.querySelector('.movies')

    // очищаем предыдущие фильмы
    moviesEl.innerHTML = ''

    data.films.forEach(movie => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt = "${movie.nameRu}"
        />
        <div class="movie__cover--darker"></div>
      </div>
      <div class="movie-info">
        <div class="movie-title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(genre => `${genre.genre}`
        )}</div>
        <div class="movie__average movie__average--${movieRatingCount(movie.rating)}">${movie.rating}</div>
      </div>
        `
        moviesEl.appendChild(movieEl)
    });
}


form.addEventListener('submit', (e) => {
  e.preventDefault()

  const apiSearchUrl = `${API_SEARCH_URL}${search.value}`
  if(search.value){
    getMovies(apiSearchUrl)
  }

  search.value = ''
})