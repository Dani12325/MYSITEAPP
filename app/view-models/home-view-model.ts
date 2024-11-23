import { Observable, ApplicationSettings } from '@nativescript/core';
import { Site } from '../models/site.model';

const SITES_KEY = 'savedSites';

export class HomeViewModel extends Observable {
    private _sites: Site[] = [];

    constructor() {
        super();
        this.loadSites();
    }

    get sites(): Site[] {
        return this._sites;
    }

    private loadSites() {
        const savedSites = ApplicationSettings.getString(SITES_KEY);
        if (savedSites) {
            this._sites = JSON.parse(savedSites);
            this.notifyPropertyChange('sites', this._sites);
        }
    }

    addSite(name: string, url: string) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newSite: Site = {
            id: Date.now().toString(),
            name,
            url
        };

        this._sites.push(newSite);
        ApplicationSettings.setString(SITES_KEY, JSON.stringify(this._sites));
        this.notifyPropertyChange('sites', this._sites);
    }

    deleteSite(id: string) {
        this._sites = this._sites.filter(site => site.id !== id);
        ApplicationSettings.setString(SITES_KEY, JSON.stringify(this._sites));
        this.notifyPropertyChange('sites', this._sites);
    }
}