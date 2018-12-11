import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FloorStatus} from './floor.status';


@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnChanges {
  @Input() status: FloorStatus;
  @Input() ordered: boolean;
  @Input() elevatorArrived: boolean;
  @Output() floorCommand: EventEmitter<number> = new EventEmitter();
  floorNumber: number;
  floorOrdered = false;

  constructor() {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (!this.floorNumber) {
      this.floorNumber = this.status.number;
    }
    // if (!changes.elevatorOnFloor.isFirstChange()) {
    //   this.elevatorOnFloor = this.status.ordered;
    //   console.log(this.elevatorOnFloor);
    // }

  }


  orderElevator() {
    if (this.status.canOrder()) {
      this.floorOrdered = true;
      this.floorCommand.emit(this.status.number);
    }
  }

  isElevatorOnFloor(changes: SimpleChanges): boolean {
    return !changes.elevatorOnFloor.currentValue;
  }

  // private elevatorOnFloor() {
  //   console.log(this.elevatorService.$elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber));
  //   return this.elevatorService.$elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber);
  // }
}
