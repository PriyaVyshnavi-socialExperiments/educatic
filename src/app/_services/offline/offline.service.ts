import { Injectable, Injector } from '@angular/core';
import { SqliteStorageService } from '../sqlite-storage/sqlite.storage.service';

@Injectable({
  providedIn: 'root'
})

export class OfflineService {
  private sqlStorageService: SqliteStorageService;
  private result: any;

  constructor(public injector: Injector, table: string) {
    this.sqlStorageService = injector.get(SqliteStorageService);
    this.result = this.sqlStorageService.openStore(table);
  }

  public async SetOfflineData(key: string, value: any) {
    if (this.result) {
      if (this.sqlStorageService.isKey(key)) {
        await this.sqlStorageService.removeItem(key);
      }
      await this.sqlStorageService.setItem(key, JSON.stringify(value));
    } else {
      throw new Error(`SetOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

  public async GetOfflineData(key: string) {
    if (this.result) {
      const  item  = await this.sqlStorageService.getItem(key).then(value => {
        return JSON.parse(value);
      });
      return item;
    } else {
      throw new Error(`GetOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

  public async RemoveOfflineData(key: string) {
    if (this.result) {
      await this.sqlStorageService.removeItem(key);
    } else {
      throw new Error(`RemoveOfflineData(${key}): CapacitorDataStorageSqlite Service is not initialized.`);
    }
  }

}
