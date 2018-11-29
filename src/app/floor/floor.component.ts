import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';


import {FloorStatus} from '../elevator.models';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements  OnChanges {
  @Input() status: FloorStatus;
  @Output() floorCommand: EventEmitter<number> = new EventEmitter();
  floorNumber: number;

  constructor() {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (!this.floorNumber) {
      this.floorNumber = this.status.number;
    }

  }


  orderElevator() {
    if (this.status.canOrder()) {
      this.floorCommand.emit(this.status.number);
    }
  }

  // private elevatorOnFloor() {
  //   console.log(this.elevatorService.elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber));
  //   return this.elevatorService.elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber);
  // }
}
