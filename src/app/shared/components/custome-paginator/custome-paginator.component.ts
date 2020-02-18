import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custome-paginator',
  templateUrl: './custome-paginator.component.html',
  styleUrls: ['./custome-paginator.component.scss']
})
export class CustomePaginatorComponent implements OnInit {

    @Input() pagesize: number;
    @Input() isHasPrevPage: boolean;
    @Input() pagecount: number[];
    @Input() isHasNextPage: boolean;
    @Input() pagelength: number;
    @Input() tableTitle: string;

    @Output() updatePageEvent = new EventEmitter<number>();
    @Output() goFirstPageEvent = new EventEmitter<void>();
    @Output() goPrevPageEvent = new EventEmitter<void>();
    @Output() goNextPageEvent = new EventEmitter<void>();
    @Output() goLastPageEvent = new EventEmitter<void>();

    nowpageindex = 0;
    firstBtnIndex = 0;
    lastBtnIndex = 2;

    constructor() { }

    ngOnInit() {
   
    }

    updatePage(index: number) {
        
        this.nowpageindex = index;
        this.firstBtnIndex = Math.floor((this.nowpageindex/3))*3;  
        this.lastBtnIndex = Math.floor(this.nowpageindex/3+1)*3-1;
        this.updatePageEvent.next(index);
    }

    goFirstPage() {
        this.nowpageindex = 0;
        this.firstBtnIndex = Math.floor((this.nowpageindex/3))*3;  
        this.lastBtnIndex = Math.floor(this.nowpageindex/3+1)*3-1;
        this.goFirstPageEvent.next();
    }

    goPrevPage() {
        this.nowpageindex -= 1;
        this.firstBtnIndex = Math.floor((this.nowpageindex/3))*3;  
        this.lastBtnIndex = Math.floor(this.nowpageindex/3+1)*3-1;
        this.goPrevPageEvent.next();
          
    }

    goNextPage() {
        this.nowpageindex += 1;
        this.firstBtnIndex = Math.floor((this.nowpageindex/3))*3;  
        this.lastBtnIndex = Math.floor(this.nowpageindex/3+1)*3-1;
        this.goNextPageEvent.next();    
    }

    goLastPage() {
       
        this.nowpageindex = this.pagecount.length - 1;
        this.firstBtnIndex = Math.floor((this.nowpageindex/3))*3;  
        this.lastBtnIndex = Math.floor(this.nowpageindex/3+1)*3-1;
        this.goLastPageEvent.next();
    }
}
