import {Component, OnInit} from '@angular/core';
import {ElevatorsService} from './elevators.service';
import {Observable} from 'rxjs';
import {Status} from './elevator.models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  floorsSubject: Observable<Status[]>;
  elevatorsSubject: Observable<Status[]>;

  constructor(
    private elevatorService: ElevatorsService
  ) {

  }

  ngOnInit() {
    this.elevatorsSubject = this.elevatorService.elevatorsStatus;
    this.floorsSubject = this.elevatorService.floorStatus;
  }


  onFloorCommand($event: number) {
    this.elevatorService.updateFloorOrder($event);
  }
}
