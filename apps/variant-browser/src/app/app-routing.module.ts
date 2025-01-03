// MODULES
import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

// COMPONENTS
import {LoginComponent} from './components/login/login.component';
import {TableComponent} from './components/table/table.component';
import {AuthGuardService} from "./services/auth/auth-guard.service";

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'variants', component: TableComponent, canActivate: [AuthGuardService] },
  { path: '**', component: TableComponent, canActivate: [AuthGuardService]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
