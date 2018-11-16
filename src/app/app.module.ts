import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ElevatorService} from './elevatorService';
import { ElevatorComponent } from './elevator/elevator.component';
import { FloorComponent } from './floor/floor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ElevatorComponent,
    FloorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [ElevatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
