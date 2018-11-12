import {Injectable, OnChanges, SimpleChanges} from '@angular/core';
import {ElevatorCommand, elevatorsStatus, OrdersQueue} from './ElevatorModels';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ElevatorService implements OnChanges {


  orderQueue = new OrdersQueue();
  elevatorControl = new Subject<ElevatorCommand>();
  elevatorsStatus = elevatorsStatus;


  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.elevatorsStatus && this.isActiveElevator()) {
      this.activateElevator();
    }
  }

  callService() {
  }

  addOrder(order: number) {
    this.orderQueue.addOrder(order);

  }

  private activateElevator() {
    const requestedFloor = this.orderQueue.getOrder();
    const elevatorToMove = this.getClosestElevator(requestedFloor);
    this.moveElevator(requestedFloor, elevatorToMove);
  }

  private isActiveElevator(): boolean {
    return !!this.elevatorsStatus.status.find(
      status => status.available);
  }

  private getClosestElevator(floor: number): number {
    let result = 20;
    const availableElevators = this.elevatorsStatus.status.filter(status => status.available);
    availableElevators.forEach(elevator => {
      const distanceFromFloor = Math.abs(floor - elevator.currentFloor);
      if (result > distanceFromFloor) {
        result = elevator.elevatorNumber;
      }
    });
    return result;
  }

  private moveElevator(requestedFloor: number, elevatorToMove: number): void {
    this.elevatorControl.next({floorToMove: requestedFloor, elevatorToMove: elevatorToMove});
  }
}
