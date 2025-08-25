const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// cria o container do detalhe (invisivel por padrão)
const detailContainer = document.createElement('div');
detailContainer.id = 'pokemonDetail';
document.body.appendChild(detailContainer);

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;

    // atribui evento de clique a cada <li> adicionada
    pokemons.forEach(pokemon => {
      const li = document.querySelector(
        `.pokemon:nth-child(${offset + pokemons.indexOf(pokemon) + 1})`
      );
      li.addEventListener('click', () => mostrarDetalhes(pokemon.number));
    });
  });
}

// função para exibir detalhes em modal
function mostrarDetalhes(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      detailContainer.innerHTML = `
        <div class="overlay active">
          <div class="detail-card">
            <button id="closeDetail">✖</button>
            <h2>#${data.id} - ${data.name}</h2>
            <img src="${data.sprites.front_default || ''}" alt="${data.name}">
            <p><strong>Altura:</strong> ${data.height}</p>
            <p><strong>Peso:</strong> ${data.weight}</p>
            <p><strong>Tipos:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
          </div>
        </div>
      `;

      // fechar modal
      document.getElementById('closeDetail').addEventListener('click', () => {
        detailContainer.innerHTML = '';
      });

      // fechar clicando fora do card
      document.querySelector('.overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay')) {
          detailContainer.innerHTML = '';
        }
      });
    })
    .catch(err => console.error('Erro ao buscar detalhes', err));
}
