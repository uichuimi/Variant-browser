import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FiltersComponent } from './filters/filters.component';
import { DetailsComponent } from './details/details.component';
import { TableComponent } from './table/table.component';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    DetailsComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    CardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
