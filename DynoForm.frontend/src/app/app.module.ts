import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormioModule } from '@formio/angular';
import { provideHttpClient } from '@angular/common/http';
import { PrismService } from './services/Prism.service';
import { LandingComponent } from './landing/landing.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormListComponent } from './form-list/form-list.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormDataListComponent } from './form-data-list/form-data-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FormBuilderComponent,
    LandingComponent,
    FormListComponent,
    FormViewerComponent,
    FormDataListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormioModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PrismService, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
