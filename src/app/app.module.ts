import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routes';

import { NexusService } from './services/nexus.service';
import { EventBusService } from './services/event-bus.service';
import { LoggedInGuard } from './guards/logged-in.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    HttpModule
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
