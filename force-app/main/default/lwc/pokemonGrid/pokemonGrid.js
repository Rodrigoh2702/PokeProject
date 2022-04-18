import { LightningElement, track, api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPokemons from '@salesforce/apex/pokemonController.getPokemons';

export default class PokemonGrid extends LightningElement {
    @track error;
    @track pokemonList = [];
    //@track recordList; // The List of Complete Records
    @track pageList; // The record List which needs to be displayed in a page
    @track currentPage = 0; // by default will always be 0
    @track totalPages = 46;   // calculates the total number of pages

    @api showTable = false;
    @api records;
    @track recordsperpage = 24;
    @api columns;

    @track draftValues = [];
    @track recordsToDisplay;

    totalRecords;
    totalPages;
    pageNo = 0;
    startRecord;
    endRecord;
    end = false;
    pagelinks = [];
    isLoading = false;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    ortedBy;

    
    connectedCallback() {
        //this.totalPages = Math.ceil(pokemonList.length / recordPerPage );
        getPokemons({page: this.currentPage})
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error:', error);
        });
    }

    handleClick(event) {
        let label = event.target.label;
        if (label === "First") {
            this.handleFirst();
        } else if (label === "Previous") {
            this.handlePrevious();
        } else if (label === "Next") {
            this.handleNext();
        } else if (label === "Last") {
            this.handleLast();
        } else {
            console.log('Click');
        }
    }

    handleNext() {
        this.pageNo += 1;
        this.currentPage = this.pageNo * this.recordsperpage;
        getPokemons({page: this.currentPage})
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error:', error);
        });
    }

    handlePrevious() {
        this.pageNo -= 1;
        if (this.pageNo < 0) {
            this.pageNo = 0;
        }
        this.currentPage = this.pageNo * this.recordsperpage;
        getPokemons({page: this.currentPage})
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error:', error);
        });
    }

    handleFirst() {
        this.pageNo = 0;
        this.currentPage = this.pageNo * this.recordsperpage;
        getPokemons({page: this.currentPage})
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error:', error);
        });
    }

    handleLast() {
        this.pageNo = 46;
        this.currentPage = this.pageNo * this.recordsperpage;
        getPokemons({page: this.currentPage})
        .then((result) => {
            this.pokemonList = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.pokemonList = undefined;
            console.log('Error:', error);
        });
    }
    
}