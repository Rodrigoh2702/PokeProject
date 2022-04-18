import { LightningElement, track } from 'lwc';
import getPokemons from '@salesforce/apex/pokemonController.getPokemons';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Pokedex Number', fieldName: 'Pokedex_Number__c', type: 'number' },
    { label: 'Is Starter', fieldName: 'Is_Starter__c', type: 'boolean' },
    { label: 'Weight', fieldName: 'Weight__c', type: 'number' },
    { label: 'Height', fieldName: 'Height__c', type: 'number' }
];

export default class CalloutPokeApi extends LightningElement {

    @track error;
    @track pokemonList = [];
    @track cols = columns;
    @track page = 24;

    connectedCallback() {
        getPokemons({page: this.page})
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