import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'randomOrder' })
export class RandomOrderPipe implements PipeTransform {
    transform(list: Array<any>, isAllow): Array<any> {
        const newList = [...list];
        if(isAllow) {
            newList.sort(() => Math.random() - 0.5);
        }
        
        return newList;
    }
}

@Pipe({
    name: 'orderBy',
    pure: true
})
export class OrderByPipe implements PipeTransform {

    transform(value: any[], propertyName: string): any[] {
        if (propertyName)
            return value.sort((a: any, b: any) => b[propertyName].toString().localeCompare(a[propertyName]));
        else
            return value;
    }

}