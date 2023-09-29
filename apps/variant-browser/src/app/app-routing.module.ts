// MODULES
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// COMPONENTS
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TableComponent } from './components/table/table.component';
import { AuthGuardService } from "./services/auth/auth-guard.service";

const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '**', component: TableComponent, canActivate: [AuthGuardService]  },
  { path: 'login', component: LoginComponent  },
  { path: 'variants', component: TableComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
