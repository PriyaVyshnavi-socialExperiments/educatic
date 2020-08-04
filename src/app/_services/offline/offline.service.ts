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
  }

  public async SetOfflineData(table: string, key: string, value: any) {
    const openStore = this.sqlStorageService.openStore(table);
    if (openStore) {
      if (this.sqlStorageService.isKey(key)) {
        await this.sqlStorageService.removeItem(key);
      }
      await this.sqlStorageService.setItem(key, JSON.stringify(value)).then(() => {
        /** Check the network status and send offline data to API when connection is restored */
        if (!this.networkService.getCurrentNetworkStatus()) {
          this.offlineKeyValue = {key: table, value: key};
          this.OfflineStore(this.offlineKeyValue);
        }
      })

    } else {
      throw new Error(`SetOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

  public async GetOfflineData(table: string, key: string) {
    const openStore = this.sqlStorageService.openStore(table);
    if (openStore) {
      const item = await this.sqlStorageService.getItem(key).then(value => {
        return JSON.parse(value);
      });
      return item;
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

  private OfflineStore(offlineKeyValue:  KeyValue<string, string>) {
    const openStore = this.sqlStorageService.openStore('OfflineSyncDataKeys');
    if (openStore) {
      let data: KeyValue<string, string>[] = [];
      this.sqlStorageService.getItem('offline-data-key').then(item => {
        if (item) {
          const offlineKEyValueData = JSON.parse(item) as KeyValue<string, string>[];
          data = [... offlineKEyValueData];
        }
      });
      data.push(offlineKeyValue);
      data = [... new Set(data)];

      this.sqlStorageService.setItem('offline-data-key', JSON.stringify(data));
    }
  }
}