import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class ContentHelper {

    public static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    public static blobToFile = (theBlob: Blob, fileName: string): File => {
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return theBlob as File;
    }

    public static get ImgSupported() { return ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'] };
    public static get PdfSupported() { return ['pdf'] };
    public static get AudioVideoSupported() {
        return ['wav', 'aiff', 'alac', 'flac', 'mp3', 'aac', 'wma', 'ogg',
            'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd']
    };

    public static get ContentUploadSupported() { return [...this.ImgSupported, ...this.PdfSupported, ...this.AudioVideoSupported]; }

}