import {Injectable} from '@angular/core';
import {
  ElevatorCommand,
  ElevatorsStatus,
  elevatorsStatus,
  ElevatorStatus,
  FloorCommand,
  getElevatorsStatus,
  OrdersQueue
} from './ElevatorModels';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ElevatorService {


  orderQueue = new OrdersQueue();
  elevatorControl = new Subject<ElevatorCommand>();
  floorControl = new Subject<FloorCommand>();
  elevatorsStatus: ElevatorStatus[] = getElevatorsStatus(5) ;


  constructor() {
    console.log('hello');
    console.log(this.elevatorsStatus[0].orders.orders);
    this.floorControl.subscribe(command => {
      if (command.floorToMove && !this.isElevatorOnFloor(command.floorToMove)) {
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
      console.log('activate elevator to floor ' + requestedFloor);
      const elevatorToMove = this.getClosestElevator(requestedFloor);

      console.log('elevatorTo move', elevatorToMove);
      this.moveElevator(requestedFloor, elevatorToMove);
    }
  }

  private getClosestElevator(floor: number): number {
    console.log(this.elevatorsStatus.map(status => {
      return {...status, timeFromFloor: this.calcTotalTimeFromFloor(floor, status)};
    }).reduce((a, b) => a.timeFromFloor > b.timeFromFloor ? b : a));
    return this.elevatorsStatus.map(status => {
      return {...status, timeFromFloor: this.calcTotalTimeFromFloor(floor, status)};
    }).reduce((a, b) => a.timeFromFloor > b.timeFromFloor ? b : a).elevatorNumber;
  }

  private moveElevator(requestedFloor: number, elevatorToMove: number): void {
    console.log('sending ', elevatorToMove, 'to', requestedFloor);
    this.elevatorControl.next({floorToMove: requestedFloor, elevatorToMove: elevatorToMove});
    this.elevatorsStatus[elevatorToMove - 1].available = false;

  }

  private hasOrders() {
    return this.orderQueue.orders.length;
  }

  private isElevatorOnFloor(floorToMove: number) {
    return this.elevatorsStatus.find(elevator => elevator.currentFloor === floorToMove);
  }

  private calcTotalTimeFromFloor(floor: number, status: ElevatorStatus) {
    const allOrders = [floor, ...status.orders.orders, status.currentFloor];
    const timetillCurrentNextFloor = status.secondsToNextFloor;
    return allOrders.map((elevatorStatus, index, array) => (array[index + 1] ?
      Math.abs(elevatorStatus - array[index + 1]) / 2 + 2 : 0)).reduce((a, b) => a + b) + timetillCurrentNextFloor;
  }
}
