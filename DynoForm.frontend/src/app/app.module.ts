import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormioModule } from '@formio/angular';
import { provideHttpClient } from '@angular/common/http';
import { PrismService } from './services/Prism.service';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    FormBuilderComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormioModule
  ],
  providers: [PrismService, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
