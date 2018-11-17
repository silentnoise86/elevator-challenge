import {Component, Input, OnInit} from '@angular/core';
import {ElevatorService} from '../elevatorService';
import {Subject} from 'rxjs';
import {FloorCommand} from '../ElevatorModels';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {
  @Input() floorNumber: number;
  floorCommand: Subject<FloorCommand>;
  floorOrdered = false;
  elevatorOnCurrentFloor = this.floorNumber === 1;
  constructor(
    private elevatorService: ElevatorService
  ) {
    this.floorCommand = this.elevatorService.floorControl;
  }

  ngOnInit() {
     this.floorCommand.subscribe(signal => {
      if (signal.floorReached && signal.floorReached === this.floorNumber) {
        this.floorOrdered = false;
      }
    });
  }


  orderElevator() {
    console.log('************************************************');
    console.log(!this.elevatorOnFloor() && !this.floorOrdered);
    console.log('************************************************');
    if (!this.elevatorOnFloor() && !this.floorOrdered) {
      this.floorOrdered = true;
      this.floorCommand.next({floorHeight: (107 * this.floorNumber).toString() + 'px', floorToMove: this.floorNumber});
    }
  }

  private elevatorOnFloor() {
    return this.elevatorService.elevatorsStatus.status.find(elevator => elevator.currentFloor === this.floorNumber);
  }
}
