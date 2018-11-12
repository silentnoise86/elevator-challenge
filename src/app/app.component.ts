import {Component, OnInit} from '@angular/core';
import {ElevatorService} from './elevatorService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'elevators';
  floors: number[];
  elevators: number[];

  constructor(
    private elevatorService: ElevatorService
  ) {
    this.floors = this.createNumArray(20);
    this.elevators = this.createNumArray(3);
  }

  ngOnInit() {

  }

  createNumArray(num: number) {
    return Array(num).fill(num).map((x, i) => i);
  }


}
