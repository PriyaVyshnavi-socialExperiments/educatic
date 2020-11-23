import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { IMenuItems, Role } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService extends OfflineService {

  constructor(private http: HttpClient, public injector: Injector) {
    super(injector);
  }

  public async GetMenuList(userRole: string): Promise<IMenuItems[]> {

    const mapMenu = (menu) => {
      if (menu.roles.includes(Role[userRole])) {
        const menuItem = {} as IMenuItems;
        menuItem.active = menu.active;
        menuItem.icon = menu.icon;
        menuItem.iconClass = menu.icon;
        menuItem.name = menu.name;
        menuItem.path = menu.path;
        menuItem.roles = menu.roles;
        menuItem.open = false;
        return menuItem;
      }
    };

    return (await this.GetMenus()).map((menu) => {
        let menuItem = {} as IMenuItems;
        menuItem = mapMenu(menu);
        if (menuItem && menu?.children && menu?.children?.length > 0) {
          menuItem.children = [];
          menu.children.forEach((child) => {
            const submenu = mapMenu(child);
            if (submenu) {
              menuItem.children.push(submenu);
            }
          })
        }
        return menuItem;
      }
      );
  }

  private async GetMenus() {
    const menus = await this.AllMenus().toPromise();
    return menus;
  }

  private AllMenus(): Observable<IMenuItems[]> {
    return this.GetOfflineAllMenus().pipe(
      flatMap((menuInfo) => {
        if (!menuInfo) {
          return this.SyncMenus();
        } else {
          return of(menuInfo);
        }
      })
    );
  }

  private SyncMenus(): Observable<IMenuItems[]> {
    return this.http
      .get<IMenuItems[]>(`./assets/${environment.StaticSourcePath}/menu/nav-menus.json`)
      .pipe(
        map((menus) => menus),
        tap((menus) => {
          this.SetOfflineData('nav-menu', 'nav-menu', menus);
        })
      );
  }

  private GetOfflineAllMenus() {
    return from(this.GetOfflineData('nav-menu', 'nav-menu')).pipe(
      tap(menuData => {
        if (menuData && menuData.length > 0) {
          return menuData as IMenuItems[];
        } else {
          return of(false);
        }
      })
    );
  }
}
