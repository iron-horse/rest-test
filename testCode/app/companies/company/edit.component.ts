/**
 * 
 * This component will be used to create/update company
 * 
 */
import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';

import { Subscription } from "rxjs/Rx";
import 'rxjs/add/operator/debounceTime';

import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { Company } from '../shared/company.model';
import { CompanyService } from '../shared/company.service';
import { EventService } from '../../shared/services/events.service';

const newCompany: Company = {
  _id: null,
  name: '',
  address: '',
  revenue: '',
  phone: ''
};

@Component({
  moduleId: module.id,
  selector: '.sg-comapny-edit',
  templateUrl: './edit.component.html',
  styles: [
    `.point-with-hand {
      cursor: pointer;      
    }`
  ]
})

export class CompanyEditComponent implements OnInit, OnDestroy {

  @Input() company: Company = newCompany;

  @Output() editCancelled: EventEmitter<boolean> = new EventEmitter();
  @Output() companySaved: EventEmitter<object> = new EventEmitter();

  private companyForm: FormGroup;
  private sub1: Subscription;
  private messageObject: any;
  
  // form errors
  private formErrors: Object = {
    "name": "",
    "address": "",
    "revenue": "",
    "phone": ""
  };

  // messages for perticular fields
  private validationMessages: any = {
    'name': {
      'required': 'Name is required.'
    },
    'address': {
      'required': 'Address is required.'
    },
    'revenue': {
      'required': 'Revenue is required.'
    },
    'phone': {
      'required': 'Phone is required.',
      'pattern': 'Invalid phone number.'
    }
  };

  constructor(
    private _companyService: CompanyService,
    private _eventService: EventService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.company) {
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
  }

  // Create model driven reactive form for update/create company
  createForm(): void {
    this.companyForm = this._formBuilder.group({
      name: [this.company.name, Validators.required],
      address: [this.company.address, Validators.required],
      revenue: [this.company.revenue, Validators.required],
      phone: [this.company.phone, [
        Validators.required,
        Validators.pattern(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/) // Use a library for advance check
      ]]
    });

    // Check for valid input as user types
    this.sub1 = this.companyForm.valueChanges.debounceTime(400).subscribe( () =>
      this.onValueChanged()
    );
  }

  // Cancel process at any time.
  cancel(): void {
    this.editCancelled.emit(true); // emit event for parent components
    this.company = newCompany; // reset the company model
    this.companyForm.reset(); // reset the form
  }

  // As user types in check if value is valid or not, set appropriate error message
  onValueChanged(): void {
    if (!this.companyForm) {
      return;
    }
    for (let field in this.formErrors) {
      this.formErrors[field] = ""; // clear previous error messages (if any)
      const control: any = this.companyForm.get(field);
      if (control && control.dirty && !control.valid) {
        const messages: Object = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] += messages[key] + " ";
        }
      }
    }
  }

  // Filter data (if needed) and submit the changes through API.
  onSave(): void {
    
    // Update company's values.
    this.company = Object.assign(this.company, this.companyForm.value);
    
    if (!this.company._id) {

      // Create New company

      delete this.company._id; // delete null value for new company

      this._companyService.createCompany(this.company).subscribe(company => {
        if (!company._id) {
          // failed to create new company
          this.messageObject = Object.assign({}, {
            "status": "danger",
            "message": "Failed to create new company!"
          });
          console.error("Could not create new company");
          return;
        }
        // successfully created new company
        this.messageObject = Object.assign({}, {
          "status": "success",
          "message": "New company has been created successfully!"
        });

        this.companyForm.reset(); // reset form
        this.companySaved.emit(this.messageObject); // emit message for parent components
        this._eventService.triggerCompanyEvent(true); // triger event for new company to reflect changes in application
        this.clearMessage(); // clear success message after few seconds
      });
    } else {

      // Update existing company

      this._companyService.updateCompany(this.company).subscribe(company => {
        if (!company) {
          // failed to update an existing company
          this.messageObject = Object.assign({}, {
            "status": "danger",
            "message": "Failed to update company information!"
          });
          console.error("Could not save updates");
          return;
        }
        // successfully updated existing company
        this.messageObject = Object.assign({}, {
          "status": "success",
          "message": "Company information has been updated successfully!"
        });

        this.companySaved.emit(this.messageObject); // emit message for parent component
        this._eventService.triggerCompanyEvent(false); // trigger event to update company information in application
        this.clearMessage(); // clear success message after few secons
      });
    }
  }

  private clearMessage(): void {
    // clear success message after three seconds
    setTimeout(() => {
      this.messageObject = undefined
    }, 3000);
  }
}