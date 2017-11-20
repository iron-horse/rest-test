import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { CrudService } from './services/crud.service';
import { CacheService } from './services/cache.service';
import { EventService } from './services/events.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        CrudService,
        CacheService,
        EventService
      ]
    };
  }
}
