import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { routing, appRoutingProviders } from './app.routes';

import { NexusService } from './services/nexus.service';
import { EventBusService } from './services/event-bus.service';
import { LoggedInGuard } from './guards/logged-in.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WrapperComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    NexusService,
    EventBusService,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
