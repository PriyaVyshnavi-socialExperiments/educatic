
export interface IMenuItems {
  name: string;
  path: string;
  icon: string;
  iconClass: string;
  active: boolean;
  open: boolean;
  roles: string[];
  children: IMenuItems[];
}

