import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PersonsListComponent } from './person-list/person-list.component';
import { PersonComponent } from './person/person.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: "companies/:companyId/people",
        component: PersonsListComponent,
      },
      {
        path: "companies/:companyId/people/:personId",
        component: PersonComponent,
      }
    ])
  ],
  exports: [RouterModule]
})
export class PersonsRoutingModule { }