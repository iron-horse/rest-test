/**
 * This service will be used for common CRUD (Create, Retrieve, Update, Delete) operations
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Http } from '@angular/http';
import { CacheService } from './cache.service';

@Injectable()
export class CrudService {

  constructor (
    private _http: Http,
    private _cache: CacheService
  ) { }

  get(url: string, doCacheResponse: boolean = true, reset: boolean = false): Observable<any> {
    let key: string = url;

    if ( !reset && this._cache.has(key)) {
      return Observable.of(this._cache.get(key));
    }
    return this._http.get(url)
              .map(res => res.json())
              .do(json => {
                if (doCacheResponse) {
                  this._cache.set(key, json);
                }
              }).catch(this.handleError.bind(this));
  }

  create(url: string, model: any): Observable<any> {
    return this._http.post(url, model)
              .map(res => {
                console.log(res);
                return res.json();
              })
              .catch(this.handleError.bind(this));
  }

  update(url: string, model: any, reset: boolean = true): Observable<any> {
    return this._http.put(url, model)
              .do(json => {
                if (reset) {
                  let key: string = url;
                  this._cache.remove(key); // remove if its available
                }
              }).catch(this.handleError.bind(this));
  }

  delete(url: string): Observable<any> {
    return this._http.delete(url)
              .do(json => {
                let key = url;
                this._cache.remove(key);
              }).catch(this.handleError.bind(this));
  }

  private handleError: Function = (resWithError: any) => {
    console.log(resWithError); // TODO do not print in Prod, register to error loger service.
    return Observable.of(null);
  }

}
