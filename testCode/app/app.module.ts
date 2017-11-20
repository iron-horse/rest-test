import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CompaniesModule } from "./companies/companies.module";
import { PersonsModule } from './persons/persons.module';
import { SharedModule } from "./shared/shared.module";

import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  imports:      [ BrowserModule, CompaniesModule, PersonsModule, AppRoutingModule, SharedModule.forRoot() ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [
  {
    provide: APP_BASE_HREF,
    useValue: '/' + (window.location.pathname.split('/')[1] || '')
  }]
})
export class AppModule { }