const API_KEY = `98325a9d3ed3ec225e41ccc4d360c817`;
const image_path = `https://image.tmdb.org/t/p/w1280`;

const searchInput = document.querySelector('.search input');
const searchButton = document.querySelector('.search button')
const title = document.querySelector('.wrapper h1');
const moviesGrid = document.querySelector('.movies-grid');

const popup_container = document.querySelector('.popup-container')

// 4) ეს addClickEffects ფუნქცია აწვდის 20ვე ფილმის კარტას, 20ივეს გადაუყვება და ამაგრებს click effect-ს
function addClickEffects(cards){
    cards.forEach(card => {
        card.addEventListener('click', () => openDetails(card)) //5)ეს გამოიძახება ფილმზე დაკლიკებისას, ინახავს ფილმისid 
        //და გადავყავართ Details HTML-ზე
    })
}



//search button-ზე დამატებულია addEvenListener ფუნქციაა, რომელიც იძახებს Add search Results ფუნქციას
//
searchButton.addEventListener('click', addSearchResults);


async function getSearchResults (key) {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${key}`)
    const respData = await resp.json();
    return {data: respData.results, searchKey: key}
}

async function addSearchResults () {
    if(!searchInput.value) { //if search value ამოწმებს არის თუ არა ჩაწერილი search-ში რამე, თუ არა ტრენდულ ფილმებს ამოყრის
        addTrendings();
        return;
    }
    const {data, searchKey} = await getSearchResults(searchInput.value)//თუ რამეა ცაწერილი getSearchResults ვიყენებთ

    title.innerText = `Results for '${searchKey}':`;
    moviesGrid.innerHTML = data.map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title==null?e.name:e.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date==null?e.first_air_date:e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')

    const cards = document.querySelectorAll('.card')
    addClickEffects(cards)
}






getTrendings() // 2) ამ ფუნქციას მოაქვს 20 ტრენდული ფილმიAPIდან Jasonის სახით და პარსავს Js-ს ობიექტად
async function getTrendings () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results
}

//  3) მერე addTrendingsფუნქცია 20-ივე js ობიექტს გადაუყვება და ოცივესთვის შექმნის 20-ივე div-ს htmlში movie grid-ში
async function addTrendings () {

    const data = await getTrendings() 
    title.innerText = `Trending`;

    moviesGrid.innerHTML = data.slice().map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title==null?e.name:e.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date==null?e.first_air_date:e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')

    const cards = document.querySelectorAll('.card')
    addClickEffects(cards)

}

function openDetails(card){
    const id = card.getAttribute('data-id');
    savePicked(id);
    window.location.replace("details.html");
}
function savePicked (id) {
    localStorage.setItem('chosenMovieId', JSON.stringify(id));
}

addTrendings()
// 1) addTrending ფუნქცია ირთვება მერე და ეს იძახებს get trending ფუნქციას
