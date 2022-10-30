import {Pokemon} from '../models/Pokemon';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IPokemonData, IResult} from '../interfaces/ipokemons';
import {map, tap} from 'rxjs/operators';

import {from, Observable} from 'rxjs';
import {Storage} from '@ionic/storage-angular';

const POKEMON_KEY = 'pokemons';
const POKEMON_FAVORITE = 'pokemons-favorite';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {

  constructor(public http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  getPokemons(): Observable<Pokemon[]> {
    const url = environment.pokUrl + '?limit=' + environment.limit;
    return this.http.get<IResult>(url)
      .pipe(
        map((res: IResult) => res.results.map(v => new Pokemon(v))),
        tap((res: Pokemon[]) => console.log(res))
      );

  }

  getPokemonData(id: number): Observable<IPokemonData> {
    const url = environment.pokUrl + '/' + id + '/';
    return this.http.get<IPokemonData>(url);
  }

  async addPokemonToFavorite(pok: Pokemon) {
    const data: Pokemon[] = await this.storage.get(POKEMON_FAVORITE) ?? [];

    if (data.includes(pok)) {
      return;
    }
    data.push(pok);
    return await this.storage.set(POKEMON_FAVORITE, data);
  }

  getFavoritePokemon(): Observable<Pokemon[]> {
    return from(this.storage.get(POKEMON_FAVORITE));
  }
}
