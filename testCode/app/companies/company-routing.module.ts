import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompanyListComponent } from './company-list/compony-list.component';
import { CompanyComponent } from './company/company.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: "companies",
        component: CompanyListComponent,
      },
      {
        path: "companies/:id",
        component: CompanyComponent,
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class CompanyRoutingModule { }