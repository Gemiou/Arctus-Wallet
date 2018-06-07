import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchCoin: any): any[] {
    if(!items) return [];
    if(!searchCoin) return items;
    searchCoin.type = searchCoin.type.toLowerCase();
    searchCoin.class = searchCoin.class.toLowerCase();
    return items.filter( it => {
      return (it.class.toLowerCase() == searchCoin.class || it.type.toLowerCase() == searchCoin.type);
    });
  }
}
