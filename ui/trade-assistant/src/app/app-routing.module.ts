import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

// const redirectLoggedInToItems = () => redirectLoggedInTo(['items']);

const routes: Routes = [
  // { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToItems } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
