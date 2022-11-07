import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import POKEMESSAGECHANNEL_CHANNEL from '@salesforce/messageChannel/pokeMessageChannel__c';
import getAllPokemons from '@salesforce/apex/pokemonController.getAllPokemons';
import fetchMoreInfo from '@salesforce/apex/pokemonController.fetchMoreInfo';

export default class PokemonGrid extends LightningElement {
    totalPokemons;
    filteredPokemons;
    visiblePokemons;
    subscription;


    @track showModal = false;

    pokemonName;
    pokemonAttack;
    pokemonAttackBar;
    pokemonDefense;
    pokemonDefenseBar;
    pokemonHP;
    pokemonHPBar;
    pokemonSpAtk;
    pokemonSpAtkBar;
    pokemonSpDef;
    pokemonSpDefBar;
    pokemonSpeed;
    pokemonSpeedBar;
    pokemonWeight;
    pokemonHeight;
    pokemonTypes;
    pokemonImage;
    pokemonNumber;
    pokemonBaseExp;
    pokemonAbilities;
    pokemonImageLink;
    
    @wire(MessageContext)
    messageContext;
    
    @wire(getAllPokemons)
    wiredPokemons({ error, data }) {
        if (data) {
            this.totalPokemons = data;
            this.filteredPokemons = this.totalPokemons;
            //console.log(this.totalPokemons);
        }
        if (error) {
            console.log('Error: ', error);
        }
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext, POKEMESSAGECHANNEL_CHANNEL, (payload) => {
            this.filterPokemons(payload.pokemonName);
        });
    }

    filterPokemons(message) {
        this.filteredPokemons = this.totalPokemons.filter(pokemon => {
            return pokemon.Name.toLowerCase().includes(message.toLowerCase());
        });
    }

    connectedCallback() {
        //console.log('Connected');
        this.subscribeToMessageChannel();
        
    }
        
    updatePokemonHandler(event){
        this.visiblePokemons = [...event.detail.records];
        //console.log('Handler: ' + event);
    }



    openModal(event) {
        this.showModal = true;
        fetchMoreInfo({ pokedexNumber: event.currentTarget.dataset.id })
        .then((result) => {
            //console.log(result);
            this.pokemonName = result.Name;
            this.pokemonAttack = result.Attack__c;
            this.pokemonAttackBar = 'width: ' + result.Attack__c / 2 + '%';
            this.pokemonDefense = result.Defense__c;
            this.pokemonDefenseBar = 'width: ' + result.Defense__c / 2 + '%';
            this.pokemonHP = result.HP__c;
            this.pokemonHPBar = 'width: ' + result.HP__c / 2  + '%';
            this.pokemonSpAtk = result.Special_Attack__c;
            this.pokemonSpAtkBar = 'width: ' + result.Special_Attack__c / 2  + '%';
            this.pokemonSpDef = result.Special_Defense__c;
            this.pokemonSpDefBar = 'width: ' + result.Special_Defense__c / 2  + '%';
            this.pokemonSpeed = result.Speed__c;
            this.pokemonSpeedBar = 'width: ' + result.Speed__c / 2  + '%';
            this.pokemonWeight = result.Weight__c;
            this.pokemonHeight = result.Height__c;
            this.pokemonTypes = result.Type__c.split(';');
            this.pokemonImageLink = result.Pokemon_Image_Url__c;
            //console.log(this.pokemonImage);
            this.pokemonNumber = result.Pokedex_Number__c;
            this.pokemonBaseExp = result.Base_Experience__c;
            this.pokemonAbilities = result.Abilities__c.split(',');
            this.pokemonAbilities.forEach(ability => {
                ability = ability.charAt(0).toUpperCase() + ability.slice(1);	
                console.log(ability);
            });
            console.log(this.pokemonAbilities);
        }).catch(error => {
            console.log('Error: ', error);
        });
    }

    closeModal(event) {
        this.showModal = false;
    }

    missingImageHandler() {
        return this.pokemonImageLink = 'https://cdn-icons-png.flaticon.com/512/871/871383.png';
    }
}