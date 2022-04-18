import { LightningElement, track } from 'lwc';

export default class PokedexSearch extends LightningElement {
    queryTerm;
    clickedButtonLabel;
    PokemonName;
    PoledexNumber;
    PokemonImageUrl;

    handleKeyUp(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = event.target.value;
        }
    }

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
    }
}