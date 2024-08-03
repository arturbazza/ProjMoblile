import { Injectable } from "@angular/core";
import { Drivers, Storage } from '@ionic/storage';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private _storage: Storage | null = null;
    constructor(private storage: Storage) {
        this.initDb()
    }
    private async initDb() {
        this.storage = new Storage({
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB,
            Drivers.LocalStorage]
        });
        await this.storage.defineDriver(CordovaSQLiteDriver);
        const storage = await this.storage.create();
        this._storage = storage;
    }
    public set(key: string, value: any) {
        this._storage?.set(key, value);
    }
    async get<T>(key: string): Promise<T | null> {
        const dataObject = await this._storage?.get(key)
        if (dataObject) {
            try {
                const data: T = dataObject
                return data
            } catch (error) {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            }
        } else {
            return new Promise((resolve, reject) => {
                resolve(null)
            })
        }
    }

}
