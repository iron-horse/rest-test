/**
 * This component will be used to create/update a person
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

import { Person } from '../shared/person.model';
import { PersonService } from '../shared/person.service';
import { CompanyService } from '../../companies/shared/company.service';
import { EventService } from '../../shared/services/events.service';

const newPerson: Person = {
  _id: null,
  name: '',
  email: '',
  companyId: ''
};

@Component({
  moduleId: module.id,
  selector: '.sg-person-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
    .point-with-hand {
      cursor: pointer;
    }
    `
  ]
})

export class PersonEditComponent implements OnInit, OnDestroy {

  public personForm: FormGroup;
  @Input() person: Person = newPerson;

  @Output() editCancelled: EventEmitter<boolean> = new EventEmitter();
  @Output() personSaved: EventEmitter<object> = new EventEmitter();

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  private messageObject: any;
  private companyOptions: any[];
  
  // form errors
  private formErrors: Object = {
    "name": "",
    "email": "",
    "companyId": ""
  };

  // messages for perticular fields
  private validationMessages: any = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Invalid email.'
    },
    'companyId': {
      'required': 'Company is required.'
    }
  };

  constructor(
    private _personService: PersonService,
    private _companyService: CompanyService,
    private _eventService: EventService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.person) {
      this.createForm();
    }
    this.sub3 = this._eventService.companyUpdated.subscribe((isUpdated) => {
      // subscribe to an event of creation/updation of company details
      if (isUpdated) {
        this.updateCompanyList(); // get the updated list
      }
    });
  }

  ngOnDestroy(): void {
    this.sub1 && this.sub1.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
    this.sub3 && this.sub3.unsubscribe();
  }

  createForm(): void {
    this.personForm = this._formBuilder.group({
      name: [ this.person.name, Validators.required ],
      email: [ this.person.email,[
        Validators.required,
        Validators.pattern(/$/)
      ]],
      companyId: [ this.person.companyId, Validators.required ]
    });
    this.updateCompanyList();
    this.sub1 = this.personForm.valueChanges.debounceTime(400).subscribe(() => {
      this.onValueChanged();
    });
  }

  cancel(): void {
    this.editCancelled.emit(true);
    this.person = newPerson;
    this.personForm.reset();
  }

  // Check if value is valid or not, set appropriate error message
  // TODO: can put in an utility service for any forms in application
  onValueChanged(): void {
    if (!this.personForm) {
      return;
    }
    for (let field in this.formErrors) {
      this.formErrors[field] = ""; // clear previous error messages (if any)
      const control: any = this.personForm.get(field);
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
    // Update person's values.
    this.person = Object.assign(this.person, this.personForm.value);
    console.log("Updated Person's Value", this.person);
    if (!this.person._id) {
      delete this.person._id;
      this._personService.createUser(this.person).subscribe(person => {
        if (!person._id) {
          this.messageObject = Object.assign({}, {
            "status": "danger",
            "message": "Failed to create new person!"
          });
          console.error("Could not create new person");
          return;
        }
        this.messageObject = Object.assign({}, {
          "status": "success",
          "message": "New person has been created successfully!"
        });
        this.personForm.reset();
        this.personSaved.emit(this.messageObject);
        this._eventService.triggerPersonEvent(true, person.companyId);
        this.clearMessage();
      });
    } else {
      this._personService.updatePerson(this.person).subscribe(person => {
        if (!person) {
          this.messageObject = Object.assign({}, {
            "status": "danger",
            "message": "Failed to update person information!"
          });
          console.error("Could not save updates");
          return;
        }
        this.messageObject = Object.assign({}, {
          "status": "success",
          "message": "Person information has been updated successfully!"
        });
        this.personSaved.emit(this.messageObject);
        this._eventService.triggerPersonEvent(false, this.person.companyId);
        this.clearMessage();
      });
    }
  }

  private updateCompanyList(): void {
    this.sub2 = this._companyService.companies().subscribe((companies) => {
      this.companyOptions = [];
      companies.forEach(company => {
        this.companyOptions.push({
          name: company.name,
          _id: company._id
        });
      });
    });
  }

  private clearMessage(): void {
    setTimeout(() => {
      this.messageObject = undefined
    }, 3000);
  }
}
