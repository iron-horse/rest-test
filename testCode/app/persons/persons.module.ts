import { NgModule } from '@angular/core';

import { PersonComponent } from './person/person.component';
import { PersonsListComponent } from './person-list/person-list.component';

import { PersonService } from './shared/person.service';

import { SharedModule } from '../shared/shared.module';
import { PersonsRoutingModule } from './persons-routing.module';
import { CompaniesModule } from '../companies/companies.module';
import { PersonEditComponent } from './person/edit.component';

const exportedComponent: any[] = [
  PersonEditComponent
];

@NgModule({
  imports: [ SharedModule, PersonsRoutingModule, CompaniesModule ],
  declarations: [
    PersonsListComponent,
    PersonComponent,
    ...exportedComponent
  ],
  exports: [ ...exportedComponent ],
  providers: [ PersonService ]
})
export class PersonsModule { }