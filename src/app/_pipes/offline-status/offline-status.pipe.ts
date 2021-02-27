// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'offlineStatus'
// })
// export class OfflineStatusPipe implements PipeTransform {

//   transform(value: unknown, ...args: unknown[]): unknown {
//     return null;
//   }

// }


import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'offlineStatus',
  pure: true
})
export class OfflineStatusPipe implements PipeTransform {
  transform(contents): any {
    const anyOffline = contents.some((content) => {
      return content.isOffline === false;
    });
    return anyOffline ? 'cloud-download' : 'cloud-done';
  }
}