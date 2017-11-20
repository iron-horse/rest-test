/**
 * This component will be used to display list of people work at a particular company
 */
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Person } from '../shared/person.model';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../companies/shared/company.service';
import { EventService } from '../../shared/services/events.service';

@Component({
  selector: '.sg-persons-list',
  moduleId: module.id,
  templateUrl: './person-list.component.html'
})
export class PersonsListComponent implements OnInit, OnDestroy {
  
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;

  private persons: Person[];
  private companyName: string;
  private companyId: string;
  private addNew: boolean = false;

  constructor (
    private _companyService: CompanyService,
    private _eventService: EventService,
    private _route: ActivatedRoute
  ) {
    this.sub2 = this._route.params.subscribe(params => {
      this.companyId = params.companyId;
    });
  }

  ngOnInit(): void {
    if (!this.companyId) {
      console.warn("can not detect company id");
    }
    this.getCompanyPeople();
    this.getCompanyDetails();

    this.sub4 = this._eventService.newPerson.subscribe((companyId) => {
      if (companyId === this.companyId) {
        // update the list only if its applicable to current company
        this.getCompanyPeople();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
    this.sub3 && this.sub3.unsubscribe();
    this.sub4 && this.sub4.unsubscribe();
  }

  getCompanyPeople(): void {
    // get the list of people at a company
    this.sub1 = this._companyService.people(this.companyId).subscribe((persons) => {
      this.persons = persons;
    });
  }

  getCompanyDetails(): void {
    // get the details of a company
    this.sub3 = this._companyService.details(this.companyId).subscribe((company) => {
      this.companyName = company.name;
    });
  }
}
