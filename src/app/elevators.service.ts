import {Injectable} from '@angular/core';
import {
  ElevatorCommand, ElevatorsStatus,
    FloorStatus, Status,
} from './elevator.models';
import {BehaviorSubject, pipe, Subject} from 'rxjs';
import {UtilService} from './utilService';
import {map, tap} from 'rxjs/operators';
import {ElevatorStatus} from './elevator/elevator.status';


@Injectable({
  providedIn: 'root',
})
export class ElevatorsService {

  commandSubject = new Subject<number>();
  elevatorsStatus: BehaviorSubject<ElevatorStatus[]>;
  floorStatus: BehaviorSubject<FloorStatus[]>;
  elevatorsNum = 3;
  floorsNum = 40;


  constructor() {
    this.elevatorsStatus = this.initStatus(ElevatorStatus, this.elevatorsNum);
    this.floorStatus = this.initStatus(FloorStatus, this.floorsNum);
    this.commandSubject.pipe(
      tap(number => {
        this.floorStatus.next(this.updateFloorsStatus(this.floorStatus.value, number));
      }),
      tap(number => {
       this.updateElevatorsStatus(this.elevatorsStatus.value, number);
      })
    ).subscribe();

  }

  private initStatus(statusType: any, count: number): BehaviorSubject<any[]> {
    return new BehaviorSubject((UtilService.createNumArray(count).map(num => new statusType(num))
    ));

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
  updateFloorOrder($event: number) {
    this.commandSubject.next($event);
  }

  private getClosestElevator(floorNumber: number, elevatorsStatus: ElevatorStatus[]): ElevatorStatus {
    return elevatorsStatus.find(status => {
      return status.number === 1;
    });
  }

  private updateFloorsStatus(status: FloorStatus[], floorNumber: number): FloorStatus[] {
    const result = [...status];
    result[floorNumber].ordered = true;
    return result;
  }

  private updateElevatorsStatus(value: ElevatorStatus[], number: number) : void {
    const closestElevator = this.getClosestElevator(number, value);
    closestElevator.moveElevator(number);
  }
}
