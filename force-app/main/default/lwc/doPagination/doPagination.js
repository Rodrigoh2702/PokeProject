import { LightningElement, api } from "lwc";

export default class DoPaginaton extends LightningElement {
    currentPage = 1;
    totalPage = 0;
    totalRecords;
    @api recordSize = 24;

    get records(){
        return this.visibleRecords;
    }

    @api 
    set records(data) {
        if(data) {
            this.totalRecords = data;
            
            this.totalPage = Math.ceil(data.length / this.recordSize);
            this.updateRecords();
        }
    };
    
    get disablePrevious() {
        return this.currentPage <= 1;
    }

    get disableNext() {
        return this.currentPage >= this.totalPage;
    }

    firstHandler() {
        this.currentPage = 1;
        this.updateRecords();
    }

    previousHandler() {
        if(this.currentPage > 1) {
            this.currentPage--;
            this.updateRecords();
        }
    }
    
    nextHandler() {
        if(this.currentPage < this.totalPage) {
            this.currentPage++;
            this.updateRecords();
        }
    }

    lastHandler() {
        this.currentPage = this.totalPage;
        this.updateRecords();
    }

    updateRecords(){
        const start = (this.currentPage - 1) * this.recordSize;
        const end = this.currentPage * this.recordSize;
        this.visibleRecords = this.totalRecords.slice(start, end);
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                records: this.visibleRecords
            }
        }));
    }
}