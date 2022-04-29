import { LightningElement, track } from 'lwc';
import getAllPokemons from '@salesforce/apex/pokemonController.getAllPokemons';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Pokedex Number', fieldName: 'Pokedex_Number__c', type: 'number' },
    { label: 'Weight', fieldName: 'Weight__c', type: 'number' },
    { label: 'Height', fieldName: 'Height__c', type: 'number' },
    { label: 'Types', fieldName: 'Types__c', type: 'text' },
];

export default class CalloutPokeApi extends LightningElement {

    @track error;
    @track pokemonList = [];
    @track cols = columns;
    @track page = 24;

    connectedCallback() {
        getAllPokemons()
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error: ', error);
            console.log(typeof page);
        });
    }
}