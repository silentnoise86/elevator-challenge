import {Injectable} from '@angular/core';
import {
  ElevatorCommand,
  ElevatorStatus,
  FloorCommand,
  getElevatorsStatus,
  OrdersQueue
} from './elevator.models';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ElevatorsService {


  orderQueue = new OrdersQueue();
  elevatorControl = new Subject<ElevatorCommand>();
  floorControl = new Subject<FloorCommand>();
  elevatorsStatus: ElevatorStatus[] = getElevatorsStatus(3);


  constructor() {
    this.floorControl.subscribe(command => {
      if (command.floorToMove)  {
        this.addOrder(command.floorToMove);
        this.activateElevator();
      }
    });
    this.elevatorControl.subscribe(signal => {
      if (signal.elevatorReporting) {
        // this.elevatorsStatus[signal.elevatorReporting - 1].available = true;
        this.floorControl.next({floorReached: signal.floorToMove});
        this.activateElevator();
      }
    });
  }


  addOrder(order: number) {
    this.orderQueue.addOrder(order);

  }

  private activateElevator() {
    if (this.hasOrders()) {
      const requestedFloor = this.orderQueue.getOrder();
      const elevatorToMove = this.getClosestElevator(requestedFloor);
      this.moveElevator(requestedFloor, elevatorToMove);
    }
  }

  private getClosestElevator(floor: number): number {
    return this.elevatorsStatus.map(status => {
      return {...status, timeFromFloor: this.calcTotalTimeFromFloor(floor, status)};
    }).reduce((a, b) => a.timeFromFloor > b.timeFromFloor ? b : a).elevatorNumber;
  }

  private moveElevator(requestedFloor: number, elevatorToMove: number): void {
    this.elevatorControl.next({floorToMove: requestedFloor, elevatorToMove: elevatorToMove});
    this.elevatorsStatus[elevatorToMove - 1].available = false;

  }

  private hasOrders() {
    return this.orderQueue.orders.length;
  }

  private calcTotalTimeFromFloor(floor: number, status: ElevatorStatus) {
    const allOrders = [...status.orders.orders];
    const distanceFromFloorOrdered = status.nextFloor ? Math.abs(status.nextFloor - floor) / 2 : Math.abs(status.currentFloor - floor) / 2;
    const timetillCurrentNextFloor = status.secondsToNextFloor ? status.secondsToNextFloor  : 0;
    const allOrdersReduced = allOrders.length ? allOrders.map((elevatorStatus, index, array) => (array[index + 1] ?
      Math.abs(elevatorStatus - array[index + 1]) / 2 + 2 : 0)).reduce((a, b) => a + b) : 0;
    return timetillCurrentNextFloor + allOrdersReduced + distanceFromFloorOrdered;
  }
}
