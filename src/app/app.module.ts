import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ElevatorsService} from './elevators.service';
import { ElevatorComponent } from './elevator/elevator.component';
import { FloorComponent } from './floor/floor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SoundService} from './sound.service';

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
  providers: [ElevatorsService, SoundService],
  bootstrap: [AppComponent]
})
export class AppModule { }
