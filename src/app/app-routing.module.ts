import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { FrameComponent } from './components/frame/frame.component';

const routes: Routes = [
	{
		path: 'home',
		component: FrameComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '**',
		redirectTo: '/home'
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
