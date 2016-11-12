import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { routing, appRoutingProviders } from './app.routes';

import { NexusService } from './services/nexus.service';
import { EventBusService } from './services/event-bus.service';
import { LoggedInGuard } from './guards/logged-in.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WrapperComponent,
    DashboardComponent,
    UserListComponent,
    TaskListComponent
  ],
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
