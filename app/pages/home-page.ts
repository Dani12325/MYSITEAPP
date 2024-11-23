import { NavigatedData, Page } from '@nativescript/core';
import { HomeViewModel } from '../view-models/home-view-model';
import { Site } from '../models/site.model';
import { prompt } from '@nativescript/core/ui/dialogs';
import { Frame } from '@nativescript/core';

let viewModel: HomeViewModel;

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    viewModel = new HomeViewModel();
    page.bindingContext = viewModel;
}

export function onItemTap(args: any) {
    const site = viewModel.sites[args.index];
    Frame.topmost().navigate({
        moduleName: 'pages/web-view-page',
        context: site
    });
}

export function onAdd() {
    prompt({
        title: "Aggiungi Nuovo Sito",
        message: "Inserisci il nome del sito",
        okButtonText: "Avanti",
        cancelButtonText: "Annulla",
        inputType: "text"
    }).then(nameResult => {
        if (nameResult.result && nameResult.text) {
            const name = nameResult.text;
            prompt({
                title: "URL del Sito",
                message: "Inserisci l'URL del sito",
                okButtonText: "Aggiungi",
                cancelButtonText: "Annulla",
                inputType: "url"
            }).then(urlResult => {
                if (urlResult.result && urlResult.text) {
                    viewModel.addSite(name, urlResult.text);
                }
            });
        }
    });
}

export function onDelete(args: any) {
    const site = args.object.bindingContext as Site;
    viewModel.deleteSite(site.id);
}