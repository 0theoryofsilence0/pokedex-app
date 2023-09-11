import React from 'react'

const PokemonList = ({ pokemons, onSelectedPokemon }) => {

    const onPokemonClick = (pokemon) => {
        console.log('Clicked!', pokemon)
    }

    const pokemonLists = pokemons.map(pokemon => {        
        return <li 
                    key={pokemon.name} 
                    onSelectedPokemon={onSelectedPokemon}
                    onClick={() => {
                        onPokemonClick(pokemonList)
                        }}
                >
                {pokemon.name}
                </li>
    })

    return (
        <div>
            <ul>
                {pokemonLists}
            </ul>
        </div>
    )
}

export default PokemonList