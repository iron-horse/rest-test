import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { Company } from './company.model';
import { Person } from '../../persons/shared/person.model';
import { CrudService } from '../../shared/services/crud.service';
import { CacheService } from '../../shared/services/cache.service';

@Injectable()
export class CompanyService extends CrudService {

  private baseURL: string;
  
  constructor (
    _http: Http,
    _cache: CacheService
  ) {
    super(_http, _cache);
    this.baseURL = "/companies";
  }

  companies(): Observable<Company[]> {
    return super.get(this.baseURL, false, true); // it can use a lot of client's memory to cache a big list of companies, so do not cache it.
  }

  details(companyId: string): Observable<Company> {
    return super.get(`${this.baseURL}/${companyId}`); // get the details of a company and cache the response
  }

  createCompany(company: Company): Observable<Company> {
    return super.create(this.baseURL, company); // create a new company
  }

  updateCompany(company: Company, reset: boolean = true): Observable<Company> {
    return super.update(`${this.baseURL}/${company._id}`, company, reset);   // update company and also remove the cached value
  }
  
  people(companyId: string): Observable<Person[]> {
    return super.get(`${this.baseURL}/${companyId}/people`, false, true); // get a list of people work at a company
  }

}
