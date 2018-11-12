import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ElevatorService} from '../elevatorService';
import {ElevatorCommand} from '../ElevatorModels';

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss']
})

export class ElevatorComponent implements OnInit {
  @Input() elevatorNumber: number;
  @ViewChild('elevatorElm')  elevatorElm: ElementRef;
  elevatorControl: Subject<ElevatorCommand>;
  floorOrdered: boolean;

  constructor(
    private elevatorService: ElevatorService
  ) {

  }

  ngOnInit() {
    console.log(this.elevatorNumber);
    this.elevatorControl = this.elevatorService.elevatorControl;
    this.floorOrdered = this.getElevatorStatus();
    this.elevatorControl.subscribe(command => {
      if (command.elevatorToMove === this.elevatorNumber) {
        this.moveElevator(command.floorToMove);
      }
    });
  }

  private moveElevator(floorToMove: number) {
    if (!this.isFloorOrdered()) {


    }
  }

  private isFloorOrdered(): boolean {
    return this.elevatorService.elevatorsStatus.status.find(elevator => elevator.elevatorNumber === this.elevatorNumber).available;
  }

  private getElevatorStatus(): boolean {
    return this.elevatorService.elevatorsStatus.status.
    find(elevator => elevator.elevatorNumber === this.elevatorNumber).available;
  }
}
