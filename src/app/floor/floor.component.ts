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

  logHeight($event) {
    console.log($event.target.nativeElement.height);
  }

  orderElevator() {
    this.floorOrdered = true;
    this.floorCommand.next({floorHeight: (107 * this.floorNumber).toString() + 'px', floorToMove: this.floorNumber});
  }
}
