import {Injectable} from '@angular/core';
import {
  ElevatorCommand, ElevatorsStatus,
  ElevatorStatus,
  FloorStatus, Status,
} from './elevator.models';
import {BehaviorSubject, pipe, Subject} from 'rxjs';
import {UtilService} from './utilService';
import {map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ElevatorsService {


  elevatorControl = new Subject<ElevatorCommand>();
  floorControl = new Subject<FloorStatus>();
  elevatorsStatus: BehaviorSubject<ElevatorStatus[]>;
  floorStatus: BehaviorSubject<FloorStatus[]>;
  elevatorsNum = 3;
  floorsNum = 40;

  constructor() {
    this.elevatorsStatus = this.initStatus(ElevatorStatus, this.elevatorsNum);
    this.floorStatus = this.initStatus(FloorStatus, this.floorsNum);
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
    const floorStatusChanged = {...(new FloorStatus($event)), ordered: true};
    // console.log(fl)
    // this.floorStatus.next([...this.floorStatus.value, floorStatusChanged]);
    this.floorStatus.pipe(
      map(floorStatus => [...floorStatus, {...floorStatus.find(status => status.number === $event), ordered: true}]),
      tap(status => this.floorStatus.next(status)),
      tap(
        floorStatus => {
          const updatedElevatorStatus = this.elevatorsStatus.getValue()
            .find(elevStatus => elevStatus.number === this.getClosestElevator($event).number);
          updatedElevatorStatus.moveElevator($event);
          this.elevatorsStatus.next([...this.elevatorsStatus.getValue(), updatedElevatorStatus]);

        }
      ),
    );

    this.elevatorsStatus.next([...this.elevatorsStatus.value]);
  }

  private getClosestElevator(floorNumber: number): ElevatorStatus {
    return this.elevatorsStatus.getValue().find(status => {
      return status.number === 1;
    });
  }
}
