import { Injectable, Injector } from '@angular/core';
import { OfflineService } from '../offline/offline.service';
import { KeyValue } from '../../_models/key-value';
import { IUserProfile } from '../../_models';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class SyncOfflineService extends OfflineService {

  constructor(
    public injector: Injector,
    public userProfile: UserProfileService) {
    super(injector);
  }

  public SyncOffline() {
    this.GetOfflineData('OfflineSyncDataKeys', 'offline-data-key').then((offlineKEyValueData: KeyValue<string, string>[]) => {
      if (offlineKEyValueData) {
        offlineKEyValueData.forEach((item: KeyValue<string, string>) => {
          this.SyncOfflineData(item)
        })
      }
    });
  }

  private SyncOfflineData(offlineKeyValue: KeyValue<string, string>) {
    switch (offlineKeyValue.key) {
      case 'User':
        this.GetOfflineData(offlineKeyValue.key, offlineKeyValue.value).then((user: IUserProfile) => {
          this.userProfile.SyncUserProfile(user).subscribe(() => {
          });
        });
        break;
      default:
        break;
    }
  }

}

