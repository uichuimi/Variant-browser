// MODULES
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TableComponent } from './components/table/table.component';
import { RegisterComponent } from './components/register/register.component';
import { GenotypeFilterComponent } from './components/genotype-filter/genotype-filter.component';
import { PropertiesFilterComponent } from './components/properties-filter/properties-filter.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { VariantDetailsComponent } from './components/variant-details/variant-details.component';
import { environment } from '../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { VariantTableToolbarComponent } from './components/variant-table-toolbar/variant-table-toolbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VariantFilterPanelComponent } from './components/variant-filter-panel/variant-filter-panel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { DeviceWidthBreakpointDirective } from './directives/device-width-breakpoint.directive';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { FilterVisualizerComponent } from './components/filter-visualizer/filter-visualizer.component';
import { ListboxModule } from "primeng/listbox";
import { TableModule } from "primeng/table";
import { OrderListModule } from "primeng/orderlist";
import { ChipModule } from "primeng/chip";
import { SidebarModule } from "primeng/sidebar";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TableComponent,
    RegisterComponent,
    GenotypeFilterComponent,
    PropertiesFilterComponent,
    NavbarComponent,
    VariantDetailsComponent,
    VariantTableToolbarComponent,
    VariantFilterPanelComponent,
    DeviceWidthBreakpointDirective,
    FilterVisualizerComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTableModule,
    MatTooltipModule,
    DragDropModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTabsModule,
    MatGridListModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    OverlayModule,
    SplitterModule,
    TabViewModule,
    DropdownModule,
    InputNumberModule,
    MultiSelectModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    ChipsModule,
    ListboxModule,
    TableModule,
    OrderListModule,
    ChipModule,
    SidebarModule
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: 'environment', useValue: environment.serverUrl }],
})
export class AppModule {}
