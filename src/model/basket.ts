export interface Basket {
  article: string;
  prix: string;
  sexe: string;
  sport: string;
  photo: string;
  couleur: string;
}

export interface Baskets {
  Page: number;
  Pages: number;
  PageSize: number;
  Count: number;
  List: Basket[];
}
