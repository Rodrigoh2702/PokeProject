import { LightningElement, api } from 'lwc';

export default class PokeModal extends LightningElement {
    @api showModal;

    constructor() {
        super();
        this.showModal = false;
    }
}