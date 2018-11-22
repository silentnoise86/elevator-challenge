import {Component, Input, OnInit} from '@angular/core';
import {ElevatorsService} from '../elevators.service';
import {Subject} from 'rxjs';
import {FloorCommand} from '../elevator.models';

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
    private elevatorService: ElevatorsService
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
    console.log(this.elevatorService.elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber));
    return this.elevatorService.elevatorsStatus.find(elevator => elevator.currentFloor === this.floorNumber);
  }
}
