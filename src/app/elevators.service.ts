import {Injectable} from '@angular/core';
import {
  ElevatorCommand, ElevatorsStatus,
  ElevatorStatus,
  FloorCommand,
} from './elevator.models';
import {BehaviorSubject, Subject} from 'rxjs';
import {UtilService} from './utilService';


@Injectable({
  providedIn: 'root',
})
export class ElevatorsService {


  elevatorControl = new Subject<ElevatorCommand>();
  floorControl = new Subject<FloorCommand>();
  elevatorsStatus: BehaviorSubject<ElevatorsStatus>;


  constructor() {
    this.elevatorsStatus = this.initElevatorsStatus();
    console.log(this.elevatorsStatus);
    // this.floorControl.subscribe(command => {
    //   if (command.floorToMove) {
    //     this.activateElevator(command.floorToMove);
    //   }
    // });
    // this.elevatorControl.subscribe(signal => {
    //   if (signal.elevatorReporting) {
    //     // this.elevatorsStatus[signal.elevatorReporting - 1].available = true;
    //     this.floorControl.next({floorReached: signal.floorToMove});
    //   }
    // });
  }
  //
  // private activateElevator(floorToMove: number) {
  //   const elevatorToMove = this.getClosestElevator(floorToMove);
  //   this.moveElevator(floorToMove, elevatorToMove);
  //
  // }
  //
  // private getClosestElevator(floor: number): number {
  //   return this.elevatorsStatus.map(status => {
  //     return {...status, timeFromFloor: this.calcTotalTimeFromFloor(floor, status)};
  //   }).reduce((a, b) => a.timeFromFloor > b.timeFromFloor ? b : a).elevatorNumber;
  // }
  //
  // private moveElevator(requestedFloor: number, elevatorToMove: number): void {
  //   this.elevatorControl.next({floorToMove: requestedFloor, elevatorToMove: elevatorToMove});
  //   this.elevatorsStatus[elevatorToMove - 1].available = false;
  //
  // }
  //
  private initElevatorsStatus(): BehaviorSubject<ElevatorsStatus> {
    return new BehaviorSubject(new ElevatorsStatus
    (UtilService.createNumArray(3).map(num => new ElevatorStatus(num))));

  }
  //
  //
  // private calcTotalTimeFromFloor(floor: number, status: ElevatorStatus) {
  //   const allOrders = [...status.orders.orders];
  //   const distanceFromFloorOrdered = status.nextFloor ? Math.abs(status.nextFloor - floor) / 2 : Math.abs(status.currentFloor - floor) / 2;
  //   const timeTillCurrentNextFloor = status.secondsToNextFloor ? status.secondsToNextFloor : 0;
  //   const allOrdersReduced = allOrders.length ? allOrders.map((elevatorStatus, index, array) => (array[index + 1] ?
  //     Math.abs(elevatorStatus - array[index + 1]) / 2 + 2 : 0)).reduce((a, b) => a + b) : 0;
  //   return timeTillCurrentNextFloor + allOrdersReduced + distanceFromFloorOrdered;
  // }
}
