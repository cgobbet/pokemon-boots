var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=800';
  var $modalContainer = $('#modal-container');

  function add(pokemon) {
    if (typeof(pokemon) === 'object') {
      repository.push(pokemon);
    } else {
      alert("This is not an object");
    }
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $pokemonList = $('.list-group');
    var $pokemonListItem = $('<li class="list-group-item d-flex justify-content-center" id="pokemonItem">');
    var $pokemonButton = $('<button type="button" class="btn text-center" id="pokemonButton"></button>');

    $pokemonListItem.appendTo($pokemonList);
    $pokemonButton.appendTo($pokemonListItem);
    $pokemonButton.text(pokemon.name);

    // $pokemonButton.addClass('button-class');
    // $pokemonListItem.addClass('pokemon-list__item');

    $pokemonButton.click(function() {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl, {
      dataType: 'json'
    }).then(function(pokemon) {
      $.each(pokemon.results, function(i, pokemon) {
        var pokemon = {
          name: pokemon.name,
          detailsurl: pokemon.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    });
  }

  function loadDetails(pokemon) { // loads details of pokemons
    var url = pokemon.detailsurl;
    return $.ajax(url, {
        dataType: 'json'
      })
      .then(function(details) {
        // Now we add the details to the item
        pokemon.imageUrl = details.sprites.front_shiny;
        pokemon.weight = details.weight;
        pokemon.height = details.height;
        pokemon.types = Object.keys(details.types);
      }).catch(function(e) {
        console.error(e);
      });
  }

  function showDetails(pokemon) { // retrieves details from API
    pokemonRepository.loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  function showModal(pokemon) {
    $($modalContainer).html('');
    // creates div for modal itself
    var $modal = $('<div id="modal"></div>');
    $modal.addClass('modal');

    // creates button to close modal and activate hideModal()
    var $modalCloseButton = $('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonButton">Close</button>');
    $modalCloseButton.addClass('modal-close');
    $modalCloseButton.text('Close');
    $modalCloseButton.click(function() {
      hideModal();
    });

    var $modalPokemonName = $('<h2 class="capital"></h2>');
    $modalPokemonName.text(pokemon.name);
    /*  addClass not added as class will be "modal h2" */

    var $modalPokemonImg = $('<img class="modal-img"></img>');
    $modalPokemonImg.attr('src', pokemon.imageUrl);
    $modalPokemonImg.addClass('modal-img');

    var $modalPokemonHeight = $('<p class="capital"></p>');
    $modalPokemonHeight.text(pokemon.name + ' is ' + (pokemon.height / 10) + 'm tall and weighs ' + (pokemon.weight / 10) + ' kg!');
    /*  addClass not added as class will be "modal p" */

    $modalCloseButton.appendTo($modal);
    $modalPokemonName.appendTo($modal);
    $modalPokemonImg.appendTo($modal);
    $modalPokemonHeight.appendTo($modal);
    $modal.appendTo($modalContainer);

    $modalContainer.addClass('is-visible');
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

  $('body').click(function() {
    hideModal();
  });

  $(document).keydown(function(event) {
    if (event.keyCode == 27) {
      hideModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };

})();
/*  end of IIFE function */

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
