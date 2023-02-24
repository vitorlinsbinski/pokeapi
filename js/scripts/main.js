var slide_hero = new Swiper('.slide-hero', {
    effect: 'fade',
    pagination: {
        el: ".slide-hero .main-area .area-explore .swiper-pagination",
    }
});

const htmlContainer = document.documentElement;

const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');

const btnDropdownSelect = document.querySelector('.js-open-select-custom');


const urlApi = 'https://pokeapi.co/api/v2/pokemon?limit=9&offset=0';

const spanTypePokemonDropdown = document.getElementById('js-select-type-pokemon');

const countPokemons = document.getElementById('js-count-pokemons');

const areaPokemonNotFound = document.getElementById('js-pok-not-found');
    
cardPokemon.forEach((card, index) => {
    card.addEventListener('click', openDetailsPokemon);
});

if(btnCloseModal) {
    btnCloseModal.addEventListener('click', closeDetailsPokemon);
}

if(btnDropdownSelect) {
    btnDropdownSelect.addEventListener('click', () => {
        btnDropdownSelect.parentElement.classList.toggle('active');
    });
}


const areaPokemons = document.getElementById('js-list-pokemons');



function firstWordToUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function scrollToSection() {
    const sectionPokemons = document.querySelector('.s-all-info-pokemons');
    const topSection = sectionPokemons.offsetTop;
    window.scrollTo({
        top: topSection + 288,
        behavior: "smooth"
    })
}


function createCardPokemon(code, type, name, imagePok) {
    // Criar Card que engloba o pokémon
    let card = document.createElement('button');
    card.classList = `card-pokemon js-open-details-pokemon ${type}`;
    card.setAttribute('code-pokemon', code)

    // Criar a div que contém a imagem do pokémon
    let imageDiv = document.createElement('div');
    imageDiv.classList = 'image';

    // Criar a imagem do pokémon que está dentro da div image
    let imageSrc = document.createElement('img');
    imageSrc.classList = 'thumb-img';
    imageSrc.setAttribute('src', imagePok);

    // Criar a div que contém as informações do pokémon
    let infoCardPokemon = document.createElement('div');
    infoCardPokemon.classList = 'info';

    // Criar a div que engloba o código do pokémon e o nome
    let textCard = document.createElement('div');
    textCard.classList = 'text';

    // Criar o span com o código do pokémon
    let codeSpan = document.createElement('span');
    codeSpan.innerText = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;

    // Criar o título que tem o nome do pokémon
    let namePokemonTitle = document.createElement('h3');
    namePokemonTitle.innerText = firstWordToUpperCase(name);

    // Criar a div com o ícone do tipo do pokémon
    let iconDiv = document.createElement('div');
    iconDiv.classList = 'icon';

    // Criar a imagem do tipo do pokémon
    let imgIcon = document.createElement('img');
    imgIcon.setAttribute('src', `./assets/icon-types/${type}.svg`);

    iconDiv.appendChild(imgIcon);

    textCard.appendChild(codeSpan);
    textCard.appendChild(namePokemonTitle);

    imageDiv.appendChild(imageSrc);

    infoCardPokemon.appendChild(textCard);
    infoCardPokemon.appendChild(iconDiv);

    card.appendChild(imageDiv);
    card.appendChild(infoCardPokemon);
    card.style.animation = 'fadeIn .5s ease'
    areaPokemons.appendChild(card);
}

let arrayCount = [];

function handleReceivedPokemonData(res) {
    const {name, id, sprites, types} = res.data;

    const infoCard = {
        name: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name
    }



    if(infoCard.image) {
        arrayCount.push(infoCard);

        createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);

    }

    
    const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

    cardPokemon.forEach(card => {
        card.addEventListener('click', openDetailsPokemon)
    })
}

function listingPokemons(urlApi) {
    axios({
        method: 'GET',
        url: urlApi
    })
    .then(res => {
        const {results, next, count} = res.data;
        const allPokemonsDiv = document.getElementById('js-all-pokemons');

        countPokemons.innerText = count;

        spanTypePokemonDropdown.innerText = firstWordToUpperCase('All');

    
        if(areaPokemons.children.length == '') {
            loadingText.classList.add('active');
        } 




        results.forEach(pokemon => {
            let urlApiDetails = pokemon.url;

            axios({
                method: 'GET',
                url: urlApiDetails
            })
            .then(res => {
                handleReceivedPokemonData(res);
                
                if(areaPokemons.children.length != '') {
                    loadingText.classList.remove('active');
                } 

            })
        })
    })
}

listingPokemons(urlApi);

function searchWeakness(urlType) {
    axios({
        method: 'GET',
        url: urlType
    })
    .then(res => {
        let weakness = res.data.damage_relations.double_damage_from;
        return weakness;
    })


}



function openDetailsPokemon() {
    htmlContainer.classList.add('open-modal');
    htmlContainer.classList.add('lock-scroll');

    let codePokemon = this.getAttribute('code-pokemon');
    let imagePokemon = this.querySelector('.thumb-img');
    let iconTypePokemon = this.querySelector('.info .icon img'); 
    let namePokemon = this.querySelector('.info h3').textContent;
    let codePokemonCard = this.querySelector('.info span').textContent;


    const modalDetails = document.getElementById('js-modal-details');
    const iconTypePokemonModal = document.getElementById('js-image-type-modal');
    const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
    const namePokemonModal = document.getElementById('js-name-pokemon-modal');
    const codePokemonModal = document.getElementById('js-code-pokemon-modal');

 
    imgPokemonModal.setAttribute('src', imagePokemon.getAttribute('src'));
    modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
    iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));
    namePokemonModal.textContent = namePokemon;
    codePokemonModal.textContent = codePokemonCard;

    axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`
    })
    .then(res => {
        let {data} = res;

        let infoPokemon = {
            types: data.types,
            height: data.height / 10,
            weight: data.weight,
            mainAbility: firstWordToUpperCase(data.abilities[0].ability.name),
            allAbilities: data.abilities,
            stats: data.stats,
            urlType: data.types[0].type.url,
        }

        function listingTypesPokemon() {
            let arrayTypes = infoPokemon.types;
            const areaTypesModal = document.getElementById('js-types-pokemon');
            areaTypesModal.innerHTML = '';  

            arrayTypes.map(itemType => {

                let itemList = document.createElement('li');

                let textList = document.createElement('span');
                textList.classList = `tag-type ${itemType.type.name}
                `;
                textList.textContent = firstWordToUpperCase(itemType.type.name);

                itemList.appendChild(textList);
                areaTypesModal.appendChild(itemList);
            })
        }

        function listingInfoPokemon() {
            const heightPokemonElement = document.getElementById('js-height-pokemon');
            const weightPokemonElement = document.getElementById('js-weight-pokemon');
            const mainAbilityPokemonElement = document.getElementById('js-main-ability-pokemon');

            heightPokemonElement.textContent = `${infoPokemon.height}m`;
            weightPokemonElement.textContent = `${infoPokemon.weight}kg`;
            mainAbilityPokemonElement.textContent = infoPokemon.mainAbility;
        }

        function listingWeakness() {
            let urlType = infoPokemon.urlType;
            const areaWeaknessModal = document.getElementById('js-weakness-pokemon');
            
            areaWeaknessModal.innerHTML = '';
            axios({
                method: 'GET',
                url: urlType
            })
            .then(res => {
                let{data} = res;

                let weakness = data.damage_relations.double_damage_from;

                weakness.forEach(weak => {

                    let itemList = document.createElement('li');
    
                    let textList = document.createElement('span');
                    textList.classList = `tag-type ${weak.name}
                    `;
                    textList.textContent = firstWordToUpperCase(weak.name);
    
                    itemList.appendChild(textList);
                    areaWeaknessModal.appendChild(itemList);
                })
            })
        }

        const statsHpModal = document.getElementById('js-stats-hp');
        const statsAttackModal = document.getElementById('js-stats-attack');
        const statsDefenseModal = document.getElementById('js-stats-defense');
        const statsSpAttackModal = document.getElementById('js-stats-sp-attack');
        const statsSpDefenseModal = document.getElementById('js-stats-sp-defense');
        const statsSpeedModal = document.getElementById('js-stats-speed');



        function listingStats() {
            let stats = infoPokemon.stats;


            let statsHp = stats[0].base_stat;
            let statsAttack = stats[1].base_stat;
            let statsDefense = stats[2].base_stat;
            let statsSpAttack = stats[3].base_stat;
            let statsSpDefense = stats[4].base_stat;
            let statsSpeed= stats[5].base_stat;


            statsHpModal.style.width = `${statsHp}%`;
            statsAttackModal.style.width = `${statsAttack}%`;
            statsDefenseModal.style.width = `${statsDefense}%`;
            statsSpAttackModal.style.width = `${statsSpAttack}%`;
            statsSpDefenseModal.style.width = `${statsSpDefense}%`;
            statsSpeedModal.style.width = `${statsSpeed}%`;
            // stats.forEach(stat => {
            //     let baseStat = stat.base_stat;


            // })
        }

        listingTypesPokemon();
        listingInfoPokemon();
        listingWeakness();
        listingStats();
    })
}

function closeDetailsPokemon() {
    htmlContainer.classList.    remove('open-modal');
    htmlContainer.classList.remove('lock-scroll');
}

function listenToTypeButtons() {
    const allTypes = document.querySelectorAll('.type-filter');

    allTypes.forEach(btn => {
        btn.addEventListener('click', filterPokemonsByTypes)
    })
}

function createListPokemonsArea(type, index) {
    let itemDiv = document.createElement('li');

    let buttonTypePokemon = document.createElement('button');
    buttonTypePokemon.classList = `type-filter ${type}`;
    buttonTypePokemon.setAttribute('code-type', index);

    let iconDiv = document.createElement('div');
    iconDiv.classList = 'icon';

    let imgTypePokemon = document.createElement('img');
    imgTypePokemon.setAttribute('src', `./assets/icon-types/${type}.svg`);

    let txtTypePokemon = document.createElement('span');
    txtTypePokemon.innerText = firstWordToUpperCase(type);

    iconDiv.appendChild(imgTypePokemon);

    buttonTypePokemon.appendChild(iconDiv);
    buttonTypePokemon.appendChild(txtTypePokemon);

    itemDiv.appendChild(buttonTypePokemon);


    areaTypes.appendChild(itemDiv);
    
    listenToTypeButtons();
}

const buttonTypePok = document.querySelector('.js-type-filter');

buttonTypePok.addEventListener('click', (e) => {

    e.preventDefault(); 

    btnDropdownSelect.parentElement.classList.remove('active');
})

function createListPokemonsAreaMobile(type, index) {
    let itemDivMobile = document.createElement('li');   

    let buttonTypePokemon = document.createElement('button');
    buttonTypePokemon.classList = `type-filter ${type} js-type-filter`;
    buttonTypePokemon.setAttribute('code-type', index);

    let iconDiv = document.createElement('div');
    iconDiv.classList = 'icon';

    let imgTypePokemon = document.createElement('img');
    imgTypePokemon.setAttribute('src', `./assets/icon-types/${type}.svg`);

    let txtTypePokemon = document.createElement('span');
    txtTypePokemon.innerText = firstWordToUpperCase(type);

    iconDiv.appendChild(imgTypePokemon);

    buttonTypePokemon.appendChild(iconDiv);
    buttonTypePokemon.appendChild(txtTypePokemon);
    
    itemDivMobile.appendChild(buttonTypePokemon);
    areaTypesMobile.appendChild(itemDivMobile);

    listenToTypeButtons();

    buttonTypePokemon.addEventListener('click', (e) => {
        e.preventDefault();
        btnDropdownSelect.parentElement.classList.remove('active');
    });

}




const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');

axios({
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/type'
})
.then(res => {
    const {results} = res.data;

    results.forEach((type, index) => {
        if(index < 18) {
            const {name} = type;

            createListPokemonsArea(name, index);
            createListPokemonsAreaMobile(name, index);
        } 
    })
})

const btnLoadMore = document.getElementById('js-btn-load-more');

let countPaginator = 10;

btnLoadMore.addEventListener('click', showMorePokemon);

function showMorePokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPaginator}`;

    listingPokemons(url);

    countPaginator = countPaginator + 9;

    if(areaPokemons.children.length <= countPaginator) {
        loadingText.classList.add('active');

    } else {
        loadingText.classList.remove('active');

    }
}

function filterPokemonsByTypes() {
    let idPokemon = this.getAttribute('code-type');
    let urlId = `https://pokeapi.co/api/v2/type/${String(Number(idPokemon) + 1)}`;

    btnLoadMore.style.display = 'none';
    areaPokemons.innerHTML = '';

    scrollToSection()

    // const buttonToBeDesactived = Array.from(areaTypes.children)
    //     .filter(btn => btn.children[0] != this)
    //     .find(btn => btn.children[0].classList.contains('active'))

    // if(buttonToBeDesactived) {
    //     buttonToBeDesactived.children[0].classList.remove('active');
    // }

    const allTypes = document.querySelectorAll('.type-filter');


    allTypes.forEach(type => {
        type.classList.remove('active');
    })

    this.classList.add('active');

    if(idPokemon) {
        axios({
            method: 'GET',
            url: urlId
        })
        .then(res => {
            const {pokemon, name} = res.data;
    
            spanTypePokemonDropdown.innerText = firstWordToUpperCase(name);
    
            countPokemons.innerText = pokemon.length;

            if(areaPokemons.children.length == '') {
                loadingText.classList.add('active');
                htmlContainer.classList.add('lock-scroll');
            } 
    
            pokemon.forEach(pok => {
                const {url} = pok.pokemon;
                
                axios({
                    method: 'GET',
                    url: `${url}`
                })
                .then(res => {
                    areaPokemonNotFound.classList.remove('active');
                    handleReceivedPokemonData(res);
                    
                    if(areaPokemons.children.length != '') {
                        loadingText.classList.remove('active');
                        htmlContainer.classList.remove('lock-scroll');
                    } 

                })
            })
        })
    } else {
        areaPokemons.innerHTML = '';

        scrollToSection();

        listingPokemons(urlApi);

        btnLoadMore.style.display = 'block';
    }
    


}

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');

// inputSearch.addEventListener('keyup',searchPokemon);

inputSearch.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        searchPokemon(); 
    }
})

btnSearch.addEventListener('click', searchPokemon);

const names = [
    {nome: 'vitor'},
    {nome: 'jose'},
    {nome: 'joao'}
]

const myNewArray = names.filter(currentValue => {
    return currentValue.nome.includes('j');
})


let newArrayMap = [];

function handleSearchPokemonData(res) {
                        

    const {name, id, sprites, types} = res.data;

    const infoCard = {
        name: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name
    }



    if(infoCard.image) {
        arrayCount.push(infoCard);

        countPokemons.innerText = arrayCount.length;
        

        createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);


    }

    
    const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

    cardPokemon.forEach(card => {
        card.addEventListener('click', openDetailsPokemon)
    })
}


const loadingText = document.getElementById('js-loading');


btnSearch.setAttribute('disabled', false);


inputSearch.addEventListener('keyup', () => {

    if(inputSearch.value != "") {
        btnSearch.removeAttribute('disabled');
    } else {
        btnSearch.setAttribute('disabled', false);
    }
    
})

function searchPokemon() {
    arrayCount = [];
    let valueInput = inputSearch.value.toLowerCase();

    const typeFilter = document.querySelectorAll('.type-filter');
    typeFilter.forEach(type => {
        type.classList.remove('active');
    })

    newArrayMap = [];
    

    if(valueInput != '') {


        if(valueInput.includes('0') || valueInput.includes('1') || valueInput.includes('2') || valueInput.includes('3') || valueInput.includes('4') || valueInput.includes('5') || valueInput.includes('6') || valueInput.includes('7') || valueInput.includes('8') || valueInput.includes('9')) {

            axios({
                method: 'GET',
                url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
            }) 
            .then(res => {
    
                btnLoadMore.style.display = 'none';
                areaPokemons.innerHTML = '';

                countPokemons.innerText = 1;
    
                const {name, id, sprites, types} = res.data;

                const infoCard = {
                    name: name,
                    code: id,
                    image: sprites.other.dream_world.front_default,
                    type: types[0].type.name
                }
            
            
            
                if(infoCard.image) {
            
                    createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);
            
                }
            
                
                const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
            
                cardPokemon.forEach(card => {
                    card.addEventListener('click', openDetailsPokemon)
                })
            })
            .catch(error => {
                if(error.response) {
                    areaPokemons.innerHTML = '';
                    btnLoadMore.style.display = 'none';
                    countPokemons.innerText = 0;
                    areaPokemonNotFound.classList.add('active');
                    areaPokemonNotFound.style.animation = 'fadeIn .3s ease';
                }
            })

        } else {
            axios({
                method: 'GET',
                url: 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
            }) 
            .then(res => {
                let {results} = res.data;
    
        
                let all = results.filter(pok => {
                    return pok.name.includes(valueInput);
                })
    
                btnLoadMore.style.display = 'none';
                areaPokemons.innerHTML = '';

                


                if(all.length != 0) {
                    areaPokemonNotFound.classList.remove('active');
                    areaPokemonNotFound.style.animation = 'fadeOut .3s ease';
                    all.forEach(pok => {
                        const url = pok.url;
        
                        if(areaPokemons.children.length == '') {
                            loadingText.classList.add('active');
                            htmlContainer.classList.add('lock-scroll');
                        } 
        
    
    
                        
                        axios({
                            method: 'GET',
                            url: `${url}`
                        })
                        .then(res => {
                            handleSearchPokemonData(res);
                            if(areaPokemons.children.length != '') {
                                loadingText.classList.remove('active');
                                htmlContainer.classList.remove('lock-scroll');
                                areaPokemonNotFound.classList.remove('active');
                                areaPokemonNotFound.style.animation = 'fadeOut .3s ease';
                            } else {
                                areaPokemons.innerHTML = '';
                                btnLoadMore.style.display = 'none';
                                countPokemons.innerText = 0;
                                areaPokemonNotFound.classList.add('active');
                                areaPokemonNotFound.style.animation = 'fadeIn .3s ease';
                            }
                        })
                    })
                } else {
                    areaPokemons.innerHTML = '';
                    btnLoadMore.style.display = 'none';
                    countPokemons.innerText = 0;
                    areaPokemonNotFound.classList.add('active');
                    areaPokemonNotFound.style.animation = 'fadeIn .3s ease';

                }

            })
            .catch(error => {
                if(error.response) {
                    areaPokemons.innerHTML = '';
                    btnLoadMore.style.display = 'none';
                    areaPokemonNotFound.classList.add('active');
                    areaPokemonNotFound.style.animation = 'fadeIn .3s ease';
                    countPokemons.innerText = 0;
                }
            })
        }





    } 
}

