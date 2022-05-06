// MODULES
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TableComponent } from './components/table/table.component';
import { TableFooterComponent } from './components/table/table-footer/table-footer.component';
import { RegisterComponent } from './components/register/register.component';
import { GenotypeFilterComponent } from './components/genotype-filter/genotype-filter.component';
import { PropertiesFilterComponent } from './components/properties-filter/properties-filter.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TableComponent,
    TableFooterComponent,
    RegisterComponent,
    GenotypeFilterComponent,
    PropertiesFilterComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
