/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

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
const url = `https://pokeapi.co/api/v2/pokemon?limit=50`;
fetch(url)
.then(response => response.json())
.then(data => {
const searchButton = document.querySelector('.custom-search-btn');
const searchInput = document.querySelector('.custom-search');

const pokemonList = data.results;

searchButton.addEventListener('click', () => {
    const searchItem = searchInput.value.trim().toLowerCase(); 
    if (searchItem === '') {
      alert('Please enter a valid Pokémon name or ID');
      return;
    }

    // Search by name or ID
    const foundPokemon = pokemonList.find(pokemon => {
      const idFromUrl = pokemon.url.split('/').filter(Boolean).pop(); 
      return pokemon.name === searchItem || idFromUrl === searchItem;
    });

    if (foundPokemon) {
      const pokemonId = foundPokemon.url.split('/').filter(Boolean).pop();
      console.log(`Found Pokémon: ${foundPokemon.name}`);
      console.log(`ID: ${pokemonId}`);
      console.log(`URL: ${foundPokemon.url}`);
    } 
    else {
      alert('No Pokémon found with the given name or ID.');
    }
  });
})
.catch(error => console.log(error));


