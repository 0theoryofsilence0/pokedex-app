import React from 'react'
import axios from 'axios'
import './App.css'

class App extends React.Component { 

    state = { pokemons : [], isFetchingPokemons: false, selectedPokemon: null, isFetchingSelectedPokemon: false }

    componentDidMount() {
        this.fetchPokemons()
    }

    fetchPokemons = async () => {
        
        this.setState({ isFetchingPokemons: true })

        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=251')
        this.setState({ 
            pokemons: response.data.results,
            isFetchingPokemons: false
        })

    }



    onPokemonClick = (pokemonUrl) => {
        console.log(pokemonUrl)
        this.fetchSelectedPokemon(pokemonUrl)
    }

    fetchSelectedPokemon = async url => {

        this.setState({ isFetchingSelectedPokemon: true })
        
        const response = await axios.get(url)

        // Game Indices
        let promises = response.data.game_indices.map((g,i) => {
            return axios.get(g.version.url)
        })

        let versions = await Promise.all(promises)
        versions = versions.map(r => {
            return r.data.names.find(n => n.language.name == 'en').name
        }).reverse()

        response.data.versions = versions
            this.setState({
                selectedPokemon: response.data,
                isFetchingSelectedPokemon: false
            })

    }

    renderSelectedPokemon() {

        let { selectedPokemon, isFetchingSelectedPokemon: loading } = this.state

        if (!selectedPokemon) {
            return (
                <p className='NoSelectedPokemon'>Please select a pokemon</p>
            )
        }

        if(loading) {
            return (
                <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h2>Loading..</h2>
                </div>
            )
        }

        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <h1 style={{
                        fontSize: '60px',
                        display: 'flex !important',
                        alignItems: 'center !important'
                    }}>{selectedPokemon.name.toUpperCase()} #{selectedPokemon.id}</h1>
                </div>
                <br></br>
                <div className="pokeDetail">
                    <div className="ui grid">
                        <div className="poke-img six wide column">
                            <img src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${selectedPokemon.id.toString().padStart(3, '0')}.png`} />
                        </div>
                        <div className="poke-attributes six wide column">
                            <h4>Height: <br /><b><h2>{selectedPokemon.height}</h2></b></h4>
                            <h4>Weight: <br /><b><h2>{selectedPokemon.weight}</h2></b></h4>
                            <div>
                                <h4>Type:</h4>
                                <h2>{selectedPokemon.types[0].type.name.toUpperCase()}</h2>
                                <h2>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="pokeVersion">
                        <h4>Versions:</h4>
                        <p>{ selectedPokemon.versions.join(', ') }</p>
                    </div>
                </div>            
            </div>
        )
    }

    render() {

        const { pokemons, isFetchingPokemons, selectedPokemon } = this.state
        const pokemonLists = pokemons.map( (p, index) => {
            let backgroundColor = '#080505b8'
            if (selectedPokemon && p.name == selectedPokemon.name) {
                backgroundColor = 'red'
            }
            return <div className='item itemCss' style={{
                backgroundColor
            }}
                        onClick={() => {
                            this.onPokemonClick(p.url)
                        }}
                        key={index}
                    >{p.name.toUpperCase()}</div>
        })

        if(isFetchingPokemons) {
            return <div>Loading...</div>
        }

        return (
            <div className="container">
                <div className="ui grid gridCss" >
                    <div>
                        <div className="four wide column" style={{overflowY: 'scroll', height: '100vh'}}>
                            <div className="ui relaxed divided list">
                                {pokemonLists}
                            </div>
                        </div>
                    </div>
                    <div className="thirteen wide column main">
                        { this.renderSelectedPokemon() }
                    </div>
                </div>
            </div>
        )
    }

}

export default App