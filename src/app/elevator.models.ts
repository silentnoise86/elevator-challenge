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

  hasOrders(): boolean {
    return !!this.orders.length;
  }
}

export class ElevatorStatus implements Status {
  number: number;
  nextFloor: number;
  available = true;
  currentFloor = 1;
  secondsToNextFloor = 0;
  orders: OrdersQueue;

  constructor(elevatorNumber: number) {
    this.number = elevatorNumber;
    this.orders = new OrdersQueue();

  }

  moveElevator(floorOrdered: number) {
    if (this.orders.hasOrders() || this.nextFloor) {
      this.orders.addOrder(floorOrdered);
    }
  }


}

export interface Status {
  number: number;
}

export interface ElevatorCommand {
  elevatorToMove?: number;
  floorToMove?: number;
  isAvailable?: boolean;
  elevatorReporting?: number;
  queue?: number[];
}

export class FloorStatus implements Status {
  number: number;
  ordered: boolean;
  floorHeight?: string;
  elevatorOnFloor: boolean;

  constructor(floorNumber) {
    this.number = floorNumber;
    this.floorHeight = (107 * this.number).toString() + 'px';

  }

  canOrder(): boolean {
    return !(this.ordered || this.elevatorOnFloor);
  }
}


export class ElevatorsStatus {
  status: ElevatorStatus[];

  constructor(status: ElevatorStatus[]) {
    this.status = status;
  }

  getStatus(elevatorNum: number) {
    this.status.find(elevator => elevator.number === elevatorNum);
  }
}

//
// export const getElevatorsStatus = function (numOfElevators: number): ElevatorStatus[] {
//   return Array(numOfElevators).fill(0).map((_, index) => {
//     return {...new ElevatorStatus(index + 1), orders: new OrdersQueue()};
//   });
// };


export const elevatorAnimation = trigger('elevatorMove', [
  state('moving', style({transform: 'translateY(0)'})),
  transition('moving=> *',
    animate('2s 100ms ease-out'))
]);

