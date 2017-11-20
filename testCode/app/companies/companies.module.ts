import { NgModule } from '@angular/core';

import { CompanyComponent } from './company/company.component';
import { CompanyListComponent } from './company-list/compony-list.component';

import { CompanyService } from './shared/company.service';
import { SharedModule } from '../shared/shared.module';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyEditComponent } from './company/edit.component';

// List of component to export
const exportedComponent: any[] = [
  CompanyEditComponent
];

@NgModule({
  imports: [ SharedModule, CompanyRoutingModule ],
  declarations: [
    CompanyListComponent,
    CompanyComponent,
    ...exportedComponent
  ],
  exports: [ ...exportedComponent ],
  providers: [ CompanyService ]
})
export class CompaniesModule { }