import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ElevatorCommand, elevatorsStatus, FloorCommand, OrdersQueue} from './ElevatorModels';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ElevatorService {


  orderQueue = new OrdersQueue();
  elevatorControl = new Subject<ElevatorCommand>();
  floorControl = new Subject<FloorCommand>();
  elevatorsStatus = elevatorsStatus;


  constructor() {
    this.floorControl.subscribe(command => {
      if (command.floorToMove) {
        this.addOrder(command.floorToMove);
        this.activateElevator();
      }
    });
    this.elevatorControl.subscribe(signal => {
      if (signal.isAvailable) {
        this.elevatorsStatus.status[signal.isAvailable - 1].available = true;
        this.floorControl.next({floorReached: signal.floorToMove});
        this.activateElevator();
      }
    });
  }


  addOrder(order: number) {
    this.orderQueue.addOrder(order);

  }

  private activateElevator() {
    if (this.isActiveElevator() && this.hasOrders()) {
      console.log(this.orderQueue);
      const requestedFloor = this.orderQueue.getOrder();
      console.log(this.orderQueue);
      const elevatorToMove = this.getClosestElevator(requestedFloor);
      this.moveElevator(requestedFloor, elevatorToMove);
    }
  }

  private isActiveElevator(): boolean {
    return !!this.elevatorsStatus.status.find(
      status => status.available);
  }

  private getClosestElevator(floor: number): number {
    const availableElevators = this.elevatorsStatus.status.filter(status => status.available && status.currentFloor !== floor);
    if (this.isActiveElevator() && !availableElevators.length) {
      this.floorControl.next({floorReached: floor});
    }
    return availableElevators.map(elevator => {
        return {...elevator, distance: Math.abs(elevator.currentFloor - floor)};
      }
    )
      .reduce((a, b) => a.distance > b.distance ? b : a).elevatorNumber;

  }

  private moveElevator(requestedFloor: number, elevatorToMove: number): void {
    this.elevatorControl.next({floorToMove: requestedFloor, elevatorToMove: elevatorToMove});
    this.elevatorsStatus.status[elevatorToMove - 1].available = false;
  }

  private hasOrders() {
    return this.orderQueue.orders.length;
  }
}
