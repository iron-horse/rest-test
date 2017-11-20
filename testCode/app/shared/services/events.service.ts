import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class EventService {

  newCompany: Subject<boolean>;
  companyUpdated: Subject<boolean>;

  newPerson: Subject<string>;

  constructor() {
    this.newCompany = new Subject();
    this.companyUpdated = new Subject();
    this.newPerson = new Subject();
  }

  triggerCompanyEvent(isNew: boolean): void {
    if (isNew) {
      this.newCompany.next(true);
    }
    this.companyUpdated.next(true);
  }

  triggerPersonEvent(isNew: boolean, companyId: string): void {
    if (isNew) {
      this.newPerson.next(companyId);
    } else {
      // if needed trigger update event
    }
  }
}