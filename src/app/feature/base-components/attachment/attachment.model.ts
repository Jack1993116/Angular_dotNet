
export class AttachmentL {
    attachLineID: number;
    fileName: string;
    fileURL: string;
    fileType: string;
    createDate: string;
    comment: string;
}

export class Attachment {
    attachID: number;
    attachmentLines: Array<AttachmentL>;
}

