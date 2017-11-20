import { Component } from '@angular/core';

@Component({
  selector: '.sg-app',
  template: `
    <h2 class="text-info">Sigfig RPT</h2>
    <hr/>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-4 pull-right">
          <div class="sg-comapny-edit"></div>
          <div class="sg-person-edit"></div>
        </div>
        <div class="col-xs-12 col-md-8">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent  { }