import { Injectable, Injector } from '@angular/core';
import { SqliteStorageService } from '../sqlite-storage/sqlite.storage.service';
import { NetworkService } from '../network/network.service';
import { KeyValue } from '../../_models/key-value';

@Injectable({
  providedIn: 'root'
})

export class OfflineService {
  private sqlStorageService: SqliteStorageService;
  private networkService: NetworkService;
  public offlineKeyValue = {} as KeyValue<string, string>;
  constructor(public injector: Injector) {
    this.sqlStorageService = injector.get(SqliteStorageService);
    this.networkService = injector.get(NetworkService);
    this.sqlStorageService.init();
  }

  public async SetOfflineData(table: string, key: string, value: any) {
    const openStore = this.sqlStorageService.openStore(table);
    if (openStore) {
      if (this.sqlStorageService.isKey(key)) {
          this.sqlStorageService.removeItem(key);
      }
      await this.sqlStorageService.setItem(key, JSON.stringify(value));
    } else {
      throw new Error(`SetOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

  public async GetOfflineData(table: string, key: string) {
  
    const openStore = this.sqlStorageService.openStore(table);
    if (openStore) {
     
      return await this.sqlStorageService.getItem(key).then(value => {
        console.log("table: ", JSON.parse(value));
        return JSON.parse(value);
      });
      // console.log("table 2: ", table);
      // return item;
    } else {
      throw new Error(`GetOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

  public async RemoveOfflineData(table: string, key: string) {
    const openStore = this.sqlStorageService.openStore(table);
    if (openStore) {
      await this.sqlStorageService.removeItem(key);
    } else {
      throw new Error(`RemoveOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

}