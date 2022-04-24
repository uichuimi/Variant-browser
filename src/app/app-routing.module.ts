import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: '', redirectTo: 'variants', pathMatch: 'full' },
  { path: 'variants', component: TableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
