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
const url = `https://pokeapi.co/api/v2/pokemon?limit=1025`;
let pokemonDetailsCache = {}; 

fetch(url)
  .then(response => response.json())
  .then(data => {
    const searchButton = document.querySelector('.custom-search-btn');
    const searchInput = document.querySelector('.custom-search');
    const pokemonImage = document.querySelector('.pokemon-image');
    const modalPokemonImage = document.querySelector('.modal-pokemon-image');
    const pokemonList = data.results;
    const pokemonDetailsContainer = document.querySelector('.pokemon-details-container');
    const modalTitle = document.querySelector('.portfolio-modal-title');

    const fetchDetails = pokemonList.map(pokemon => 
      fetch(pokemon.url)
        .then(response => response.json())
        .then(pokemonDetails => {
          pokemonDetailsCache[pokemon.name] = pokemonDetails;
        })
    );

    Promise.all(fetchDetails)
      .then(() => {
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




