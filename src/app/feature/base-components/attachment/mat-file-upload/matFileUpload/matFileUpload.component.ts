import { Component, EventEmitter, Input, Output, Inject, forwardRef, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatFileUploadQueueComponent } from '../matFileUploadQueue/matFileUploadQueue.component';
import { Constants } from '../../../../../constants';
import {ERPLogisticSiteService} from '../../../../../erp-logistic-site/erp-logistic-site.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * A material design file upload component.
 */
@Component({
    selector: 'mat-file-upload',
    templateUrl: `./matFileUpload.component.html`,
    exportAs: 'matFileUpload',
    host: {
        class: 'mat-file-upload',
    },
    styleUrls: ['./../matFileUploadQueue.scss'],
})
export class MatFileUploadComponent implements OnInit{
    private baseApi: string;

    public isUploading = false;
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    constructor(private httpClient: HttpClient,
                @Inject(forwardRef(() => MatFileUploadQueueComponent)) public matFileUploadQueue: MatFileUploadQueueComponent,
                private erpLogisticSiteService: ERPLogisticSiteService,
                public translate: TranslateService) {
        if (matFileUploadQueue) {
            this.httpUrl = matFileUploadQueue.httpUrl || this.httpUrl;
            this.httpRequestHeaders = matFileUploadQueue.httpRequestHeaders || this.httpRequestHeaders;
            this.httpRequestParams = matFileUploadQueue.httpRequestParams || this.httpRequestParams;
            this.fileAlias = matFileUploadQueue.fileAlias || this.fileAlias;
            this.baseApi = `${Constants.clientRoot}api/Attachments`;
        }

    }


    /* Http request input bindings */
    @Input()
    httpUrl = 'http://localhost:44332';

    @Input()
    httpRequestHeaders: HttpHeaders | {
        [header: string]: string | string[];
    } = new HttpHeaders();

    @Input()
    httpRequestParams: HttpParams | {
        [param: string]: string | string[];
    } = new HttpParams();

    @Input()
    fileAlias = 'file';

    @Input()
    attachID : any;

    @Input()
    get file(): any {
        return this._file;
    }
    set file(file: any) {
        this._file = file;
        this.total = this._file.size;
    }

    @Input()
    set id(id: number) {
        this._id = id;
    }
    get id(): number {
        return this._id;
    }

    /** Output  */
    @Output() removeEvent = new EventEmitter<MatFileUploadComponent>();
    @Output() uploadEvent = new EventEmitter();

    public progressPercentage = 0;
    public loaded = 0;
    public total = 0;
    private _file: any;
    private _id: number;
    private fileUploadSubscription: any;
    public fileComment = '';

    ngOnInit() {
        if(!this.attachID) {
            this.attachID = 0;
        }
    }

    private ERPlogisticSiteQuery(): string {
        const ERPCompanyIds = this.erpLogisticSiteService.getCheckedERP();
        const logisticSiteCode = this.erpLogisticSiteService.getCheckedLogisticSiteCodes();
        return `ERPCompanyId=${ERPCompanyIds.map(erp => erp.erpCompanyID).join('&ERPCompanyId=')}` +
            `&logisticSiteCode=${logisticSiteCode.join('&logisticSiteCode=')}`;
    }

    public upload(): void {
        this.isUploading = true;
        // How to set the alias?
        const formData = new FormData();
        console.log(this._file);
        formData.append(this.fileAlias, this._file, this._file.name);
        formData.append('comment', this.fileComment);

        // let httpParams = new HttpParams();
        // httpParams.append('comment', this.fileComment);

        this.fileUploadSubscription = this.httpClient.post(`${this.baseApi}/${this.attachID}?` + this.ERPlogisticSiteQuery(), formData, {
            headers: this.headers,
            observe: 'events',
            params: this.httpRequestParams,
            reportProgress: true,
            responseType: 'json'
        }).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progressPercentage = Math.floor( event.loaded * 100 / event.total );
                this.loaded = event.loaded;
                this.total = event.total;
            }
            this.uploadEvent.emit({ file: this._file, event: event });
        }, (error: any) => {
            if (this.fileUploadSubscription) {
                this.fileUploadSubscription.unsubscribe();
            }
            this.isUploading = false;
            this.uploadEvent.emit({ file: this._file, event: event });
        });
    }

    public remove(): void {
        if (this.fileUploadSubscription) {
            this.fileUploadSubscription.unsubscribe();
        }
        this.removeEvent.emit(this);
    }
}
