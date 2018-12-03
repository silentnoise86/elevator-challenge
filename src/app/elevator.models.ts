import {animate, state, style, transition, trigger} from '@angular/animations';
import {UtilService} from './utilService';
import {ElevatorStatus} from './elevator/elevator.status';


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

