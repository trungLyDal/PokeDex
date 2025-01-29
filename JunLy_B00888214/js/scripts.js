window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(pokemonName) {
    const index = favorites.indexOf(pokemonName);
    if (index === -1) {
        favorites.push(pokemonName);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteBadges();
    displayFavorites();
}

function isFavorite(pokemonName) {
    return favorites.includes(pokemonName);
}

function updateFavoriteBadges() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const pokemonName = btn.dataset.pokemon;
        btn.classList.toggle('active', isFavorite(pokemonName));
    });
}

function displayFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = '';

    favorites.forEach(pokemonName => {
        const pokemon = pokemonList.find(p => p.name === pokemonName);
        const pokemonDetails = pokemonDetailsCache[pokemonName];
        
        if (pokemonDetails) {
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'col-md-4 col-lg-3 mb-4';
            favoriteCard.innerHTML = `
                <div class="portfolio-item mx-auto" style="width: 18rem;">
    <div class="position-relative shadow-lg rounded-3 p-3 bg-white">
        <button class="favorite-btn active" data-pokemon="${pokemonName}">
            <i class="fas fa-heart"></i>
        </button>
        <img class="img-fluid rounded-3" src="${pokemonDetails.sprites.front_default}" 
             alt="${pokemonName}" style="min-height: 200px; object-fit: contain;">
        <div class="text-center mt-3">
            <h4 class="text-dark mb-3">${pokemonName.toUpperCase()}</h4>
            <div class="d-flex justify-content-center">
                <button class="btn btn-danger remove-favorite px-4 py-2" 
                        data-pokemon="${pokemonName}"
                        style="font-size: 1.1rem;">
                    Remove
                </button>
            </div>
        </div>
    </div>
</div>
            `;
            favoritesGrid.appendChild(favoriteCard);
        }
    });
}

const url = `https://pokeapi.co/api/v2/pokemon?limit=100`;
let pokemonList = []; 
let pokemonDetailsCache = {}; 
let isDataLoaded = false; 

fetch(url)
  .then(response => response.json())
  .then(data => {
    pokemonList = data.results; 

    const fetchDetails = pokemonList.map(pokemon =>
      fetch(pokemon.url)
        .then(response => response.json())
        .then(pokemonDetails => {
          pokemonDetailsCache[pokemon.name] = pokemonDetails; 
          console.table(pokemonDetails);
        })
    );

    Promise.all(fetchDetails)
      .then(() => {
        isDataLoaded = true; 
        displayFavorites();
        console.log('Pokémon data loaded successfully.');

        displayPokemon(pokemonList);
        console.table(pokemonList);

        const searchButton = document.querySelector('.custom-search-btn');
        const searchInput = document.querySelector('.custom-search');
        const pokemonImage = document.querySelector('.pokemon-image');
        const modalPokemonImage = document.querySelector('.modal-pokemon-image');
        const pokemonDetailsContainer = document.querySelector('.pokemon-details-container');
        const modalTitle = document.querySelector('.portfolio-modal-title');

        searchButton.addEventListener('click', () => {
          const searchItem = searchInput.value.trim().toLowerCase();
          if (searchItem === '') {
            alert('Please enter a valid Pokémon name or ID');
            return;
          }

          const foundPokemon = pokemonList.find(pokemon => {
            const idFromUrl = pokemon.url.split('/').filter(Boolean).pop();
            return pokemon.name === searchItem || idFromUrl === searchItem;
          });

          if (foundPokemon && pokemonDetailsCache[foundPokemon.name]) {
            const pokemonDetails = pokemonDetailsCache[foundPokemon.name];
            const imageUrl = pokemonDetails.sprites.front_default;
            if (imageUrl) {
              pokemonImage.classList.add('hidden');
              modalPokemonImage.classList.add('hidden');

              setTimeout(() => {
                pokemonImage.src = imageUrl;
                pokemonImage.alt = foundPokemon.name;
                pokemonImage.classList.remove('hidden');

                modalPokemonImage.src = imageUrl;
                modalPokemonImage.alt = foundPokemon.name;
                modalPokemonImage.classList.remove('hidden');
                console.log('Image loaded successfully.');
                console.log('Pokemon name:', foundPokemon.name);
                console.log('Pokemon ID:', pokemonDetails.id);
              }, 500);
            } else {
              console.log('No image available for this Pokémon.');
            }
            console.log('Pokemon details:', pokemonDetails);
            modalTitle.textContent = foundPokemon.name;
            pokemonDetailsContainer.innerHTML = 
            `
              <div class="pokemon-details-container">
                <table class="pokemon-table">
                  <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                  </tr>
                  <tr>
                    <td><strong>Pokemon ID</strong></td>
                    <td>${pokemonDetails.id}</td>
                  </tr>
                  <tr>
                    <td><strong>Types</strong></td>
                    <td>${pokemonDetails.types.map(type => type.type.name.toUpperCase()).join(', ')}</td>
                  </tr>
                  <tr>
                    <td><strong>Height</strong></td>
                    <td>${pokemonDetails.height / 10} m</td>
                  </tr>
                  <tr>
                    <td><strong>Weight</strong></td>
                    <td>${pokemonDetails.weight / 10} kg</td>
                  </tr>
                  <tr>
                    <td><strong>Abilities</strong></td>
                    <td>${pokemonDetails.abilities.map(ability => ability.ability.name.toUpperCase()).join(', ')}</td>
                  </tr>
                  <tr>
                    <td><strong>Base Experience</strong></td>
                    <td>${pokemonDetails.base_experience}</td>
                  </tr>
                </table>
                <div class="moves-section">
                  <h3>Moves</h3>
                  <details class="move-category">
                    <summary>Level Up Moves</summary>
                    <ul>
                      ${pokemonDetails.moves
                        .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'))
                        .map(move => `<li>${move.move.name.toUpperCase()} (Level ${move.version_group_details.find(detail => detail.move_learn_method.name === 'level-up').level_learned_at})</li>`)
                        .join('')}
                    </ul>
                  </details>
                  <details class="move-category">
                    <summary>TM/HM Moves</summary>
                    <ul>
                      ${pokemonDetails.moves
                        .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'machine'))
                        .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                        .join('')}
                    </ul>
                  </details>
                  <details class="move-category">
                    <summary>Breeding Moves</summary>
                    <ul>
                      ${pokemonDetails.moves
                        .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'egg'))
                        .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                        .join('')}
                    </ul>
                  </details>
                </div>
              </div>
            `;
          } else {
            alert('No Pokémon found.');
          }
        });
      })
      .catch(error => console.log(error));
  })
  .catch(error => console.log(error));

const fireCheckbox = document.getElementById('fire-type');
const waterCheckbox = document.getElementById('water-type');
const grassCheckbox = document.getElementById('grass-type');
const electricCheckbox = document.getElementById('electric-type');
const psychicCheckbox = document.getElementById('psychic-type');
const iceCheckbox = document.getElementById('ice-type');
const dragonCheckbox = document.getElementById('dragon-type');
const darkCheckbox = document.getElementById('dark-type');
const fairyCheckbox = document.getElementById('fairy-type');
const fightingCheckbox = document.getElementById('fighting-type');
const flyingCheckbox = document.getElementById('flying-type');
const ghostCheckbox = document.getElementById('ghost-type');
const groundCheckbox = document.getElementById('ground-type');
const rockCheckbox = document.getElementById('rock-type');
const bugCheckbox = document.getElementById('bug-type');
const poisonCheckbox = document.getElementById('poison-type');
const steelCheckbox = document.getElementById('steel-type');
const normalCheckbox = document.getElementById('normal-type');


const checkboxes = [fireCheckbox, waterCheckbox, grassCheckbox, 
  electricCheckbox, psychicCheckbox, iceCheckbox, dragonCheckbox,
   darkCheckbox, fairyCheckbox, fightingCheckbox, flyingCheckbox, ghostCheckbox,
    groundCheckbox, rockCheckbox, bugCheckbox, poisonCheckbox, steelCheckbox, normalCheckbox];

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterPokemonByType);
});

function filterPokemonByType() {
  if (!isDataLoaded) {
    alert('Pokémon data is still loading. Please wait.');
    return;
  }

  const selectedTypes = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedTypes.push(checkbox.value.toLowerCase());
    }
  });

  if (selectedTypes.length === 0) {
    displayPokemon(pokemonList);
  } else {
    const filteredPokemon = pokemonList.filter(pokemon => {
      const pokemonDetails = pokemonDetailsCache[pokemon.name];
      if (pokemonDetails) {
        const pokemonTypes = pokemonDetails.types.map(type => type.type.name.toLowerCase());
        return selectedTypes.some(type => pokemonTypes.includes(type));
      }
      return false;
    });
    displayPokemon(filteredPokemon);
  }
}

function displayPokemon(pokemonList) {
  const pokemonGrid = document.getElementById('pokemon-grid');
  pokemonGrid.innerHTML = '';

  pokemonList.forEach(pokemon => {
      const pokemonDetails = pokemonDetailsCache[pokemon.name];
      if (pokemonDetails) {
          const pokemonCard = document.createElement('div');
          pokemonCard.className = 'col-md-6 col-lg-4 mb-5';
          pokemonCard.innerHTML = `
              <div class="portfolio-item mx-auto" data-bs-toggle="modal" data-bs-target="#portfolioModal1">
                  <div class="position-relative">
                      <button class="favorite-btn" data-pokemon="${pokemon.name}">
                          <i class="${isFavorite(pokemon.name) ? 'fas' : 'far'} fa-heart"></i>
                      </button>
                      <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                          <div class="portfolio-item-caption-content text-center text-white">
                              <i class="fas fa-plus fa-3x"></i>
                          </div>
                      </div>
                      <img class="img-fluid pokemon-image" src="${pokemonDetails.sprites.front_default}" alt="${pokemon.name}" />
                  </div>
              </div>
          `;
          pokemonGrid.appendChild(pokemonCard);
      }
  });
  
  updateFavoriteBadges();
}
document.addEventListener('click', function (event) {
  if (event.target.closest('.portfolio-item')) {
    const pokemonImage = event.target.closest('.portfolio-item').querySelector('.pokemon-image');
    const pokemonName = pokemonImage.alt;
    const pokemonDetails = pokemonDetailsCache[pokemonName];

    if (pokemonDetails) {
      const modalTitle = document.querySelector('.portfolio-modal-title');
      const modalPokemonImage = document.querySelector('.modal-pokemon-image');
      const pokemonDetailsContainer = document.querySelector('.pokemon-details-container');

      modalTitle.textContent = pokemonName;
      modalPokemonImage.src = pokemonDetails.sprites.front_default;
      modalPokemonImage.alt = pokemonName;

      pokemonDetailsContainer.innerHTML = `
        <div class="pokemon-details-container">
          <table class="pokemon-table">
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
            <tr>
              <td><strong>Pokemon ID</strong></td>
              <td>${pokemonDetails.id}</td>
            </tr>
            <tr>
              <td><strong>Types</strong></td>
              <td>${pokemonDetails.types.map(type => type.type.name.toUpperCase()).join(', ')}</td>
            </tr>
            <tr>
              <td><strong>Height</strong></td>
              <td>${pokemonDetails.height / 10} m</td>
            </tr>
            <tr>
              <td><strong>Weight</strong></td>
              <td>${pokemonDetails.weight / 10} kg</td>
            </tr>
            <tr>
              <td><strong>Abilities</strong></td>
              <td>${pokemonDetails.abilities.map(ability => ability.ability.name.toUpperCase()).join(', ')}</td>
            </tr>
            <tr>
              <td><strong>Base Experience</strong></td>
              <td>${pokemonDetails.base_experience}</td>
            </tr>
          </table>
          <div class="moves-section">
            <h3>Moves</h3>
            <details class="move-category">
              <summary>Level Up Moves</summary>
              <ul>
                ${pokemonDetails.moves
                  .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'))
                  .map(move => `<li>${move.move.name.toUpperCase()} (Level ${move.version_group_details.find(detail => detail.move_learn_method.name === 'level-up').level_learned_at})</li>`)
                  .join('')}
              </ul>
            </details>
            <details class="move-category">
              <summary>TM/HM Moves</summary>
              <ul>
                ${pokemonDetails.moves
                  .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'machine'))
                  .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                  .join('')}
              </ul>
            </details>
            <details class="move-category">
              <summary>Breeding Moves</summary>
              <ul>
                ${pokemonDetails.moves
                  .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'egg'))
                  .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                  .join('')}
              </ul>
            </details>
          </div>
        </div>
        <div class="evolution-chain-container">
          <h3>Evolution Chain</h3>
          <div class="evolution-chain">
           <button>Load Evolution Chain</button>
          </div>
        </div>
      `;
    }
  }
});
document.addEventListener('click', async function(event) {
  if (event.target.closest('.evolution-chain button')) {
    const modalTitle = document.querySelector('.portfolio-modal-title');
    const pokemonName = modalTitle.textContent.toLowerCase();
    const pokemonDetails = pokemonDetailsCache[pokemonName];
    const evolutionChainContainer = event.target.closest('.evolution-chain');
    
    evolutionChainContainer.innerHTML = 
    ``

    try {
      const speciesResponse = await fetch(pokemonDetails.species.url);
      const speciesData = await speciesResponse.json();
      
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const chain = formatEvolutionChain(evolutionData.chain);
      displayEvolutionChain(chain, evolutionChainContainer);
    } catch (error) {
      evolutionChainContainer.innerHTML = '<p>Failed to load evolution chain. Please try again.</p>';
      console.error('Error loading evolution chain:', error);
    }
  }
});

function formatEvolutionChain(chain) {
  const evolution = {
    name: chain.species.name,
    min_level: chain.evolution_details[0]?.min_level,
    trigger: chain.evolution_details[0]?.trigger?.name,
    item: chain.evolution_details[0]?.item?.name
  };

  const evolutions = [evolution];
  
  if (chain.evolves_to.length > 0) {
    chain.evolves_to.forEach(evo => {
      evolutions.push(...formatEvolutionChain(evo));
    });
  }

  return evolutions;
}

function displayEvolutionChain(chain, container) {
  const html = chain.map((evo, index) => {
    const pokemon = pokemonDetailsCache[evo.name];
    if (!pokemon) return '';
    
    let evolutionDetails = '';
    if (index > 0) {
      const details = [];
      if (evo.min_level) details.push(`Level ${evo.min_level}`);
      if (evo.trigger && evo.trigger !== 'level-up') details.push(evo.trigger.replace('-', ' '));
      if (evo.item) details.push(`Use ${evo.item.replace('-', ' ')}`);
      evolutionDetails = details.length ? `<div class="evolution-details">(${details.join(', ')})</div>` : '';
    }

    return `
      <div class="evolution-stage">
        <div class="pokemon-link" data-pokemon-name="${evo.name}" style="cursor: pointer;">
          <img src="${pokemon.sprites.front_default}" alt="${evo.name}">
          <div class="evolution-name">${evo.name.toUpperCase()}</div>
          ${evolutionDetails}
        </div>
        ${index < chain.length - 1 ? '<div class="evolution-arrow">→</div>' : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="evolution-chain-display">
      ${html}
    </div>
  `;

  container.querySelectorAll('.pokemon-link').forEach(link => {
    link.addEventListener('click', () => {
      const pokemonName = link.dataset.pokemonName;
      const pokemonDetails = pokemonDetailsCache[pokemonName];
      
      if (pokemonDetails) {
        const modalTitle = document.querySelector('.portfolio-modal-title');
        const modalPokemonImage = document.querySelector('.modal-pokemon-image');
        const pokemonDetailsContainer = document.querySelector('.pokemon-details-container');
        
        modalTitle.textContent = pokemonName;
        modalPokemonImage.src = pokemonDetails.sprites.front_default;
        modalPokemonImage.alt = pokemonName;

        pokemonDetailsContainer.innerHTML = `
          <div class="pokemon-details-container">
            <table class="pokemon-table">
              <tr>
                <th>Attribute</th>
                <th>Value</th>
              </tr>
              <tr>
                <td><strong>Pokemon ID</strong></td>
                <td>${pokemonDetails.id}</td>
              </tr>
              <tr>
                <td><strong>Types</strong></td>
                <td>${pokemonDetails.types.map(type => type.type.name.toUpperCase()).join(', ')}</td>
              </tr>
              <tr>
                <td><strong>Height</strong></td>
                <td>${pokemonDetails.height / 10} m</td>
              </tr>
              <tr>
                <td><strong>Weight</strong></td>
                <td>${pokemonDetails.weight / 10} kg</td>
              </tr>
              <tr>
                <td><strong>Abilities</strong></td>
                <td>${pokemonDetails.abilities.map(ability => ability.ability.name.toUpperCase()).join(', ')}</td>
              </tr>
              <tr>
                <td><strong>Base Experience</strong></td>
                <td>${pokemonDetails.base_experience}</td>
              </tr>
            </table>
            <div class="moves-section">
              <h3>Moves</h3>
              <details class="move-category">
                <summary>Level Up Moves</summary>
                <ul>
                  ${pokemonDetails.moves
                    .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'))
                    .map(move => `<li>${move.move.name.toUpperCase()} (Level ${move.version_group_details.find(detail => detail.move_learn_method.name === 'level-up').level_learned_at})</li>`)
                    .join('')}
                </ul>
              </details>
              <details class="move-category">
                <summary>TM/HM Moves</summary>
                <ul>
                  ${pokemonDetails.moves
                    .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'machine'))
                    .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                    .join('')}
                </ul>
              </details>
              <details class="move-category">
                <summary>Breeding Moves</summary>
                <ul>
                  ${pokemonDetails.moves
                    .filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'egg'))
                    .map(move => `<li>${move.move.name.toUpperCase()}</li>`)
                    .join('')}
                </ul>
              </details>
            </div>
          </div>
          <div class="evolution-chain-container">
            <h3>Evolution Chain</h3>
            <div class="evolution-chain">
             <button>Load Evolution Chain</button>
            </div>
          </div>
        `;
      }
    });
  });
}
document.addEventListener('click', function(event) {
  if (event.target.closest('.favorite-btn')) {
      const button = event.target.closest('.favorite-btn');
      const pokemonName = button.dataset.pokemon;
      toggleFavorite(pokemonName);
      button.querySelector('i').classList.toggle('far');
      button.querySelector('i').classList.toggle('fas');
      event.stopPropagation();
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('portfolioModal1'));
      if (modal) {
          modal.hide();
      }
  }

  if (event.target.closest('.remove-favorite')) {
      const button = event.target.closest('.remove-favorite');
      const pokemonName = button.dataset.pokemon;
      toggleFavorite(pokemonName);
      displayFavorites();
  }
});