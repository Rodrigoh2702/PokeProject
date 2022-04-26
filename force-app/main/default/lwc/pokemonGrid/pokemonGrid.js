import { LightningElement, wire, track } from 'lwc';
import getAllPokemons from '@salesforce/apex/pokemonController.getAllPokemons';

export default class PokemonGrid extends LightningElement {
    totalPokemons;
    visiblePokemons;

    @track showModal = false;
    
    @wire(getAllPokemons)
    wiredPokemons({ error, data }) {
        if (data) {
            this.totalPokemons = data;
            //console.log(this.totalPokemons);
        }
        if (error) {
            console.log('Error: ', error);
        }
    }
        
    updatePokemonHandler(event){
        this.visiblePokemons = [...event.detail.records];
        //console.log('Handler: ' + event.detail.records);
    }

    openModal(event) {
        this.showModal = true;
        console.log(event.detail);
    }

    closeModal(event) {
        this.showModal = false;
    }
}