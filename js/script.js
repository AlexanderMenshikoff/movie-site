const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86'
const API_KEY_POPULAR = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1`
const API_SEARCH_URL = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"
const API_ACTORS = `https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=`
const API_TOP250_URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1`
const API_AWAIT_FILMS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS&page=1`
const API_ACTORS_MORE_INFO = 'https://kinopoiskapiunofficial.tech/api/v1/staff/'
const API_SEARCH_STUFF = 'https://kinopoiskapiunofficial.tech/api/v1/persons?name='


const form = document.querySelector('form')
const search = document.querySelector('.header__search')
const searchIcon = document.querySelector('.fa-solid.fa-magnifying-glass')
const top250Movies = document.querySelector('.header__top250')
const awaitMovies = document.querySelector('.header__await-movies')
const popularMovies = document.querySelector('.header__popular-movies')
const modalEl = document.querySelector('.modal')


top250Movies.addEventListener('click', () => getMovies(API_TOP250_URL))
awaitMovies.addEventListener('click', () => getMovies(API_AWAIT_FILMS))
popularMovies.addEventListener('click', () => getMovies(API_KEY_POPULAR))


//Запуск процесса

getMovies(API_KEY_POPULAR)

//Поиск(выдает сначала похожие по запросу фильмы, затем имена)

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const apiSearchUrl = `${API_SEARCH_URL}${search.value}`
  const apiSearchUrlStaff = `${API_SEARCH_STUFF}${search.value}`
  if(search.value){
    getMovies(apiSearchUrl)
    getStaffIcons(apiSearchUrlStaff)
  search.value = ''
  search.classList.toggle('hidden')
  }
})

//по клику вводная строка исчезает и наоборот

searchIcon.addEventListener('click', ()=>{
  search.classList.toggle('hidden')
})

//Функция, берущая данные с сервера и отправляющая их в showMovies(), далее в функциях, где встречается get присходит тоже самое, только с другими данными

async function getMovies(url){
    const resp = await fetch(url, {
        headers:{
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },

    })
    const respData = await resp.json()
    showMovies(respData)
}

//Функция, добавляющая к классу цвет, в зависимости от значения поступающего числа

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

//Сама функция, которая выводит фильмы на страницу, далее в функциях, где встречается show присходит тоже самое, только с другими данными

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
      <div class="movie__info">
        ${movie.nameRu ? `<div class="movie__title">${movie.nameRu}</div>`  : '<div class="movie__title">Нет названия</div>' }
        ${(movie.rating === 'null') || (!movie.rating)   ?  '' : ` <div class="movie__average movie__average--${movieRatingCount(movie.rating)}">${movie.rating}</div>`} 
      </div>
        `
        movieEl.addEventListener('click', () => openModal(movie.filmId))
        moviesEl.appendChild(movieEl)           
    });
  }


// Modal window

  async function openModal(id) {
    const resp = await fetch(API_MOVIE_DETAILS + id, {
      headers:{
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY
      },
  
  })
  const respData = await resp.json()
  
    modalEl.classList.add('modal--show')
    document.body.classList.add('stop-scrolling')
  
  modalEl.innerHTML = `
    <div class="modal__card">
    <div class="modal__button-close">X</div>
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
      <h2>
        ${respData.nameRu ? `<span class="modal__movie-title"> ${respData.nameRu}</span>` : '<span class="modal__movie-title">Нет названия</span>'}
        <span class="modal__movie-release-year">(${respData.year})</span>
      </h2>
      <ul class="modal__movie-info">
        <li class="modal__movie-category">Жанр: ${respData.genres.map(genre => ` ${genre.genre}`)}</li>
        ${respData.filmLength ? `<li class="modal__movie-runtime">Продолжительность: ${respData.filmLength} минут</li>` : ''}
        <li>Ссылка на КП: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li><a class="modal__staff">Посмотреть каст → </a></li>
        ${respData.description ? `<li class="modal__movie-overview"> Описание: ${respData.description}</li>` : '<li class="modal__movie-overview">Нет описания</li>'}
      </ul>
    </div>
  `
  const btnClose = document.querySelector('.modal__button-close')
  const cast = document.querySelector('.modal__staff')
  btnClose.addEventListener('click', () => closeModal())
  cast.addEventListener('click', () => closeModal())
  cast.addEventListener('click', () => getCast(respData.kinopoiskId))
  cast.addEventListener('click', () => window.scrollTo(0,0))
  }
  
  function closeModal(){
    modalEl.classList.remove('modal--show')
    document.body.classList.remove('stop-scrolling')
  }
  
  window.addEventListener('click', (e) =>{
    if(e.target === modalEl){
      closeModal()
    }
  }) 
  
  window.addEventListener('keydown', (e) => {
    if(e.keyCode === 27){
      closeModal()
    }
  })



async function getCast(id){
  const actorsResp = await fetch(API_ACTORS + id, {
    headers:{
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
    },
})

const respDataActors = await actorsResp.json()
showCast(respDataActors)
}


function showCast(data){
  const moviesEl = document.querySelector('.movies')
  moviesEl.innerHTML = ''

  data.forEach(person => {
    const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
        <div class="person__cover-inner">
          <img
            src="${person.posterUrl}"
            class="person__cover"
            alt = "${person.nameRu}"
          />
        <div class="person__cover--darker"></div>
      </div>
      <div class="person__info">
        <div class="person__name">${person.nameRu}</div>
        ${!person.description ? `<div class="person__profession">${person.professionKey}` : `<div class="person__profession">${person.description}</div>`}
      </div>
        `
        movieEl.addEventListener('click', () => openModalStaff(person.staffId))
        moviesEl.appendChild(movieEl)
  })
}

async function openModalStaff(id) {
  const resp = await fetch(API_ACTORS_MORE_INFO + id, {
    headers:{
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
    },
  })
  const respData = await resp.json()

  modalEl.classList.add('modal--show')
  document.body.classList.add('stop-scrolling')

  modalEl.innerHTML = `
  <div class="modal__card-staff">
    <div class="modal__button-close">X</div>
      <img class="modal__staff-backdrop" src="${respData.posterUrl}" alt="">
        <h2>
      ${respData.nameRu ? `<span class="modal__staff-name"> ${respData.nameRu}</span>` : '<span class="modal__staff-name">Нет информации</span>'}
        </h2>
      <ul class="modal__staff-info">
        <li class="modal__staff-profession">Деятельность: ${respData.profession}</li>
        ${respData.sex === 'MALE' ? '<li class="modal__staff-sex">Пол: Мужской</li>' : '<li class="modal__staff-sex">Пол: Женский</li>'}     
        ${respData.birthday ? `<li class="modal__staff-birthday">Дата рождения: ${respData.birthday}</li>` : ''}
        ${respData.birthplace ? `<li class="modal__staff-birthplace">Место рождения: ${respData.birthplace}</li>` : ''} 
        ${respData.death ? `<li class="modal__staff-death">Дата смерти: ${respData.death}</li>` : ''} 
        ${respData.deathplace ? `<li class="modal__staff-deathplace">Место смерти: ${respData.deathplace}</li>` : ''}
        ${respData.age > 0 ? `<li class="modal__staff-age">Возраст: ${respData.age}</li>` : ''}
        ${respData.growth ? `<li class="modal__staff-growth">Рост: ${respData.growth}</li>` : ''}
        <li>Ссылка на КП: <a class="modal__staff-link" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li><a class="modal__staff-filmography">Фильмография → </a></li>
      </ul>
  </div>
`
const btnClose = document.querySelector('.modal__button-close')
const staffMovies = document.querySelector('.modal__staff-filmography')
btnClose.addEventListener('click', () => closeModal())
staffMovies.addEventListener('click', () => getStaffMovies(API_ACTORS_MORE_INFO + id))
staffMovies.addEventListener('click', () => closeModal())
staffMovies.addEventListener('click', () => window.scrollTo(0,0))
}


async function getStaffMovies(url){
  const resp = await fetch(url, {
      headers:{
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY
      },
  })
  const respData = await resp.json()
  showStaffMovies(respData)
}

function showStaffMovies(data){
  const moviesEl = document.querySelector('.movies')

  // очищаем предыдущие фильмы
  moviesEl.innerHTML = ''

  data.films.forEach(movie => {
      const movieEl = document.createElement('div')
      movieEl.classList.add('movie')
      movieEl.innerHTML = `
    <div class="movie__cover-inner">
        ${movie.posterUrl  ? `<img src="${movie.posterUrl}" class="movie__cover" alt = "${movie.nameRu}" />` : '<div class = "black-cover__stuff"></div>'}
        ${!movie.posterUrl ? `<div class = "staff__profession">${movie.professionKey}</div>` : '' } 
        ${!movie.posterUrl ? `<div class = "staff__description">${movie.description}</div>` : ''}
        ${!movie.posterUrl ? `<div class = "poster__info">Нажмите, чтобы увидеть постер</div>` : ''}
    </div>
      <div class="movie__info">
        ${movie.nameRu ? `<div class="movie__title">${movie.nameRu}</div>`  : '<div class="movie__title">Нет названия</div>' }
        ${(movie.rating === 'null') || (!movie.rating)   ?  '' : ` <div class="movie__average movie__average--${movieRatingCount(movie.rating)}">${movie.rating}</div>`} 
      </div>
      `
      movieEl.addEventListener('click', () => openModal(movie.filmId))
      moviesEl.appendChild(movieEl)
  });
}

async function getStaffIcons(url){
  const resp = await fetch(url, {
      headers:{
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY
      },
  })
  const respData = await resp.json()
  showStaffIcons(respData)
}

function showStaffIcons(data){
  const moviesEl = document.querySelector('.movies')
  data.items.forEach(person => {
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.innerHTML = `
    <div class="staff__cover-inner">
      <img src="${person.posterUrl}" class="staff__cover" alt = "${person.nameRu}" />
      <div class="staff__cover--darker"></div>
    </div>
      <div class="staff__info">
        <div class="staff__name">${person.nameRu}</div>
      </div>
    `
    movieEl.addEventListener('click', () => openModalStaff(person.kinopoiskId))
    moviesEl.appendChild(movieEl)
});
}
