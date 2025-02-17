import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { LandingComponent } from './landing/landing.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormDataListComponent } from './form-data-list/form-data-list.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent, // Landing page for the root path
  },
  {
    path: 'form-data-list/:id',
    component: FormDataListComponent,
  },
  {
    path: 'view-form/:id/:dataId',
    component: FormViewerComponent,
  },
  {
    path: 'view-form/:id',
    component: FormViewerComponent,
  },
  {
    path: 'add-form/:id',
    component: FormBuilderComponent,
  },
  {
    path: 'add-form',
    component: FormBuilderComponent,
  },
  {
    path: 'forms',
    component: FormListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
