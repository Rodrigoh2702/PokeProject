import POKEMESSAGECHANNEL_CHANNEL from '@salesforce/messageChannel/pokeMessageChannel__c';
import { MessageContext, publish } from 'lightning/messageService';
import { LightningElement ,wire } from 'lwc';

export default class PokedexSearch extends LightningElement {
    searchTerm;
    clickedButtonLabel;

    @wire(MessageContext)
    messageContext;

    handleKeyUp(event) {
        this.searchTerm = event.target.value;
        const payload = {
            pokemonName: this.searchTerm
        }
        publish(this.messageContext, POKEMESSAGECHANNEL_CHANNEL, payload);
    }

    handleClick(event) {
        this.handleKeyUp(event);
    }
}