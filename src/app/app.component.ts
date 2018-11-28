import {Component, OnInit} from '@angular/core';
import {ElevatorsService} from './elevators.service';
import {UtilService} from './utilService';
import {BehaviorSubject, Observable} from 'rxjs';
import {ElevatorsStatus, ElevatorStatus} from './elevator.models';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  floors: number[];
  elevatorsSubject: Observable<ElevatorStatus[]>;

  constructor(
    private elevatorService: ElevatorsService
  ) {
    this.floors = UtilService.createNumArray(50);
  }

  ngOnInit() {
    this.elevatorsSubject = this.elevatorService.elevatorsStatus.pipe(map(status => status.status));
  }
  //
  // getElevatorStatus(elevatorNum) {
  //   console.log('called');
  //   this.elevatorsSubject.pipe(map(statusContainer => statusContainer.getStatus(elevatorNum)));
  // }


}
