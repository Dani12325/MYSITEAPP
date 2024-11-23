import { NavigatedData, Page, WebView } from '@nativescript/core';
import { Site } from '../models/site.model';
import { Frame } from '@nativescript/core';
import { Observable } from '@nativescript/core';

class WebViewPageModel extends Observable {
    private _site: Site;
    private _isMiniPlayerVisible: boolean = false;
    private _favicon: string = '';

    constructor(site: Site) {
        super();
        this._site = site;
    }

    get name(): string {
        return this._site.name;
    }

    get url(): string {
        return this._site.url;
    }

    get isMiniPlayerVisible(): boolean {
        return this._isMiniPlayerVisible;
    }

    get favicon(): string {
        return this._favicon || 'res://icon';
    }

    set isMiniPlayerVisible(value: boolean) {
        if (this._isMiniPlayerVisible !== value) {
            this._isMiniPlayerVisible = value;
            this.notifyPropertyChange('isMiniPlayerVisible', value);
        }
    }

    setFavicon(url: string) {
        this._favicon = url;
        this.notifyPropertyChange('favicon', url);
    }
}

let viewModel: WebViewPageModel;
let webView: WebView;

export function onNavigatingTo(args: NavigatedData) {
    const page = args.object as Page;
    const site = args.context as Site;
    viewModel = new WebViewPageModel(site);
    page.bindingContext = viewModel;
}

export function onWebViewLoaded(args: any) {
    webView = args.object as WebView;
    
    // Abilita la riproduzione in background
    if (webView.android) {
        webView.android.getSettings().setMediaPlaybackRequiresUserGesture(false);
        const wSettings = webView.android.getSettings();
        wSettings.setJavaScriptEnabled(true);
        wSettings.setDomStorageEnabled(true);
        
        // Mantieni lo schermo acceso solo durante la riproduzione
        webView.android.setKeepScreenOn(true);
    }
}

export function toggleMiniPlayer() {
    viewModel.isMiniPlayerVisible = !viewModel.isMiniPlayerVisible;
    
    if (webView && webView.android) {
        // Se il mini player è visibile, abilita la riproduzione in background
        if (viewModel.isMiniPlayerVisible) {
            webView.android.getSettings().setMediaPlaybackRequiresUserGesture(false);
            webView.android.setKeepScreenOn(false); // Permetti lo spegnimento dello schermo
        } else {
            webView.android.setKeepScreenOn(true);
        }
    }
}

export function onBackTap() {
    Frame.topmost().goBack();
}