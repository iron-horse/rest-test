import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { Person } from './person.model';
import { CrudService } from '../../shared/services/crud.service';
import { CacheService } from '../../shared/services/cache.service';

@Injectable()
export class PersonService extends CrudService {

  private baseURL: string;

  constructor (
    _http: Http,
    _cache: CacheService
  ) {
    super(_http, _cache);
    this.baseURL = "/person";
  }

  details(personId: string): Observable<Person> {
    return super.get(`${this.baseURL}/${personId}/`); // get users detail and cache the response
  }

  createUser(person: Person): Observable<Person> {
    return super.create(`${this.baseURL}`, person);
  }

  updatePerson(person: Person, reset: boolean = true): Observable<Person> {
    return super.update(`${this.baseURL}/${person._id}`, person, reset); // update person and also remove cached value
  }

  deletePerson(person: Person): Observable<Person> {
    return super.delete(`${this.baseURL}/${person._id}`); // delete the person and also remove from cache
  }
}
