import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * A material design file upload queue component.
 */
@Directive({
  selector: 'input[fileUploadInputFor], div[fileUploadInputFor]',
})
  export class FileUploadInputForDirective  {


    private _queue: any = null;
    private _element: HTMLElement;
    @Output() public fileSelected = new EventEmitter<File[]>();

    constructor(private element: ElementRef) {
        this._element = this.element.nativeElement;
    }


    @Input('fileUploadInputFor')
    set fileUploadQueue(value: any) {
        if (value) {
            this._queue = value;
        }
    }

    @HostListener('change')
    public onChange(): any {
      const files = this.element.nativeElement.files;
      console.log("Uploading files: ", files);
      this.fileSelected.emit(files);

      Object.keys(files).map( (index) => {
            this._queue.add(files[index]);
        });
      this.element.nativeElement.value = '';
    }

    @HostListener('drop', [ '$event' ])
    public onDrop(event: any): any {
      const files = event.dataTransfer.files;
      this.fileSelected.emit(files);

      Object.keys(files).map( (index) => {
        this._queue.add(files[index]);
        });
      event.preventDefault();
      event.stopPropagation();
      this.element.nativeElement.value = '';
    }

    @HostListener('dragover', [ '$event' ])
    public onDropOver(event: any): any {
        event.preventDefault();
    }
  }
