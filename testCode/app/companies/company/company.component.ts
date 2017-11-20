/**
 * This component will be used to display a company's details
 */
import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Company } from '../shared/company.model';
import { Subscription } from 'rxjs/Subscription';
import { CompanyService } from '../shared/company.service';

@Component({
  moduleId: module.id,
  selector: '.sg-company',
  templateUrl: './company.component.html'
})

export class CompanyComponent implements OnInit, OnDestroy {

  @Input() company: Company;

  private sub1: Subscription;
  private sub2: Subscription;

  private companyId: string;
  private isEdit: boolean = false;
  private messageObject: object;

  constructor(
    private _companyService: CompanyService,
    private _route: ActivatedRoute
  ) {
    this.sub1 = this._route.params.subscribe(params => {
      this.companyId = params.id; // get the company Id from URL
    });
  }

  ngOnInit(): void {
    if (!this.company) {
      this.getCompanyDetails(); // get a company's details since its not available
    }
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

  getCompanyDetails(): void {
    if (!this.companyId) {
      // Failed to get company id from URL params
      console.warn('Could not get company id from params');
      return;
    }
    this.sub2 = this._companyService.details(this.companyId).subscribe(company => {
      this.company = company;
    });
  }

  doEdit(): void {
    // enable edit mode
    this.isEdit = true;
  }

  cancelEdit(): void {
    // cance edit mode
    this.isEdit = false;
  }

  saved(message: any): void {
    // show message (success/fail) on save
    this.messageObject = message;
    if (message.status === "success") {
      this.isEdit = false;
    }
  }
}