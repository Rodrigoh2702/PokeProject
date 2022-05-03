import { LightningElement, wire, track } from 'lwc';
import getAllPokemons from '@salesforce/apex/pokemonController.getAllPokemons';
import fetchMoreInfo from '@salesforce/apex/pokemonController.fetchMoreInfo';

export default class PokemonGrid extends LightningElement {
    totalPokemons;
    visiblePokemons;

    @track showModal = false;

    pokemonName;
    pokemonAttack;
    pokemonDefense;
    pokemonHP;
    pokemonSpAtk;
    pokemonSpDef;
    pokemonSpeed;
    pokemonWeight;
    pokemonHeight;
    pokemonTypes;
    pokemonImage;
    pokemonNumber;
    pokemonBaseExp;
    pokemonAbilities;
    pokemonImageLink;
    
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
        fetchMoreInfo({ pokedexNumber: event.currentTarget.dataset.id })
        .then((result) => {
            console.log(result);
            this.pokemonName = result.Name;
            this.pokemonAttack = result.Attack__c;
            this.pokemonDefense = result.Defense__c;
            this.pokemonHP = result.HP__c;
            this.pokemonSpAtk = result.Special_Attack__c;
            this.pokemonSpDef = result.Special_Defense__c;
            this.pokemonSpeed = result.Speed__c;
            this.pokemonWeight = result.Weight__c;
            this.pokemonHeight = result.Height__c;
            this.pokemonTypes = result.Types__c;
            this.pokemonImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + result.Pokedex_Number__c +'.png';
            //console.log(this.pokemonImage);
            this.pokemonNumber = result.Pokedex_Number__c;
            this.pokemonBaseExp = result.Base_Experience__c;
            this.pokemonAbilities = result.Abilities__c;
            
        }).catch(error => {
            console.log('Error: ', error);
        });
    }

    closeModal(event) {
        this.showModal = false;
    }
}