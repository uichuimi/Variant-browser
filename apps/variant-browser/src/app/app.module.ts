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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VariantFilterPanelComponent } from './components/variant-filter-panel/variant-filter-panel.component';
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
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';
import { PaginatorModule } from 'primeng/paginator';
import { VariantInfoPanelComponent } from './components/variant-info-panel/variant-info-panel.component';
import { VariantPropertyTableComponent } from './components/variant-property-table/variant-property-table.component';
import { VariantFrequencyTableComponent } from './components/variant-frequency-table/variant-frequency-table.component';
import { VariantGenotypeTableComponent } from './components/variant-genotype-table/variant-genotype-table.component';
import { VariantConsequenceTableComponent } from './components/variant-consequence-table/variant-consequence-table.component';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DownloadCsvDialogComponent } from './components/download-csv-dialog/download-csv-dialog.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { VarcanService } from './services/api/varcan-service/varcan.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { TokenStorageService } from './services/api/varcan-service/endpoints/token-storage-service/token-storage.service';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { FrequencyFilterComponent } from './components/frequency-filter/frequency-filter.component';

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
    VariantFilterPanelComponent,
    DeviceWidthBreakpointDirective,
    FilterVisualizerComponent,
    VariantInfoPanelComponent,
    VariantPropertyTableComponent,
    VariantFrequencyTableComponent,
    VariantGenotypeTableComponent,
    VariantConsequenceTableComponent,
    DownloadCsvDialogComponent,
    FrequencyFilterComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    DragDropModule,
    ReactiveFormsModule,
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
    SidebarModule,
    PaginatorModule,
    AccordionModule,
    TooltipModule,
    SpeedDialModule,
    SplitButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    PickListModule,
    FieldsetModule,
    ToolbarModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: 'environment', useValue: environment.serverUrl },
    VarcanService,
    TokenStorageService,
    AuthGuardService,
  ],
})
export class AppModule {}
