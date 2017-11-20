/**
 * This component will be used to display a person's details
 */
import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Person } from '../shared/person.model';
import { Subscription } from 'rxjs/Subscription';
import { PersonService } from '../shared/person.service';
import { CompanyService } from '../../companies/shared/company.service';

@Component({
  moduleId: module.id,
  selector: '.sg-person',
  templateUrl: './person.component.html'
})

export class PersonComponent implements OnInit, OnDestroy {

  @Input() person: Person;

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  private personId: string;
  private companyId: string;
  private companyName: string;
  private isEdit: boolean = false;
  private messageObject: object;
  private deleteConfirm: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _personService: PersonService,
    private _companyService: CompanyService,
    private _router: Router
  ) {
    this.sub2 = this._route.params.subscribe(params => {
      this.personId = params.personId;
      this.companyId = params.companyId;
    });
  }

  ngOnInit(): void {
    if (!this.person && this.personId) {
      this.getPersonDetails();
      this.getCompanyDetails();
    }
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

  getPersonDetails(): void {
    // Get the details of the person
    this.sub1 = this._personService.details(this.personId).subscribe(person => {
      this.person = person;
    });
  }

  getCompanyDetails(): void {
    // Get the details of the company
    this.sub3 = this._companyService.details(this.companyId).subscribe(company => {
      this.companyName = company.name;
    });
  }

  doEdit(): void {
    // enable edit mode for a person
    this.isEdit = true;
  }

  cancelEdit(): void {
    this.isEdit = false;
  }

  saved(message: any): void {
    this.messageObject = message;
    if (message.status === "success") {
      this.isEdit = false;
      if (this.companyId !== this.person.companyId) {
        this._router.navigate(['/companies', this.companyId, 'people']);
      }
    }
  }

  deleteConfirmation(value: boolean = true): void {
    // confirm to delete the person
    this.deleteConfirm = value;
  }

  delete(): void {
    // delete the person
    this._personService.deletePerson(this.person).subscribe(person => {
      if (!person) {
        this.messageObject = {
          status: 'danger',
          message: 'Failed to delete a person'
        }
        console.log('Could not delete a user');
        return;
      }
      console.log('Successfully deleted a user!');
      // redirect to company' people list
      this._router.navigate(['/companies', this.companyId, 'people']);
    });
  }
}
