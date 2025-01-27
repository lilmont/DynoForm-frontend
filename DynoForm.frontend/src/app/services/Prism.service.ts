import { Injectable } from '@angular/core';

declare var Prism: any; // Declare PrismJS globally

@Injectable({
    providedIn: 'root',
})
export class PrismService {
    init() {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        } else {
            console.error('Prism is not defined');
        }
    }
}
