import {animate, state, style, transition, trigger} from '@angular/animations';


export class OrdersQueue {
  orders = [];

  constructor() {

  }

  addOrder(order: number) {
    if (!this.orders.includes(order)) {
      this.orders.unshift(order);
    }
  }

  getOrder(): number {
    return this.orders.pop();
  }
}
export class ElevatorStatus {
  elevatorNumber: number;
  nextFloor: number;
  available = true;
  currentFloor = 1;
  secondsToNextFloor = 0;
  orders: OrdersQueue;
  constructor(elevatorNumber: number) {
    this.elevatorNumber = elevatorNumber;
    this.orders = new OrdersQueue();

  }


}

export interface ElevatorCommand {
  elevatorToMove?: number;
  floorToMove?: number;
  isAvailable?: boolean;
  elevatorReporting?: number;
  queue?: number[];
}
export interface FloorCommand {
   floorToMove?: number;
   floorHeight?: string;
   floorReached?: number;
}


export class ElevatorsStatus {
  constructor(status: ElevatorStatus[]) {
    this.status = status;
  }

  status: ElevatorStatus[];
}

export const elevatorsStatus = [{...new ElevatorStatus(1), orders: new OrdersQueue()}, new ElevatorStatus(2), new ElevatorStatus(3)];
export const getElevatorsStatus = function (numOfElevators: number) {
  return Array(numOfElevators).fill(0).map((_, index) => {
    return {...new ElevatorStatus(index + 1), orders: new OrdersQueue()};
  });
};


export const elevatorAnimation =  trigger('elevatorMove', [
    state('moving', style({transform: 'translateY(0)' })),
    transition('moving=> *',
      animate('2s 100ms ease-out'))
  ]);
