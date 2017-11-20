/**
 * This component will be used to list compnaies.
 */

import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CompanyService } from '../shared/company.service';
import { Subscription } from 'rxjs/Subscription';
import { Company } from '../shared/company.model';
import { EventService } from '../../shared/services/events.service';

@Component({
  selector: '.sg-company-list',
  moduleId: module.id,
  templateUrl: './company-list.component.html'
})
export class CompanyListComponent implements OnInit, OnDestroy {

  private sub1: Subscription;
  private sub2: Subscription;
  private companies: Company[];

  constructor (
    private _companyService: CompanyService,
    private _events: EventService
  ) { }

  ngOnInit(): void {
    this.getCompanies(); // get the list of companies

    // subscribe to an event which tells any submition of new company
    this.sub2 = this._events.newCompany.subscribe((isNewCompany) => {
      if (isNewCompany) {
        this.getCompanies(); // update the list for new company
      }
    });
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

  getCompanies(): void {
    this.sub1 = this._companyService.companies().subscribe((companies) => {
      this.companies = companies;
    });
  }
}