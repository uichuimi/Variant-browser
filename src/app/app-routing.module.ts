import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FiltersComponent } from './filters/filters.component';
import { DetailsComponent } from './details/details.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  /*{ path: '/Main'
  , component: TableComponent
  },
  { path: '/Filters'
  , component: FiltersComponent
  },
  { path: '/Details'
  , component: DetailsComponent
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
