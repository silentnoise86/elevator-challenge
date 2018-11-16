import {animate, animation, state, style, transition, trigger} from '@angular/animations';

export class ElevatorStatus {
  constructor(elevatorNumber: number) {
    this.elevatorNumber = elevatorNumber;
  }

  elevatorNumber: number;
  available = true;
  currentFloor = 0;
}

export interface ElevatorCommand {
  elevatorToMove?: number;
  floorToMove?: number;
  isAvailable?: number;
}
export interface FloorCommand {
   floorToMove?: number;
   floorHeight?: string;
   floorReached?: number;
}

export interface  ElevatorAvailableUpdate {
  isAvailable: number;
}


export class ElevatorsStatus {
  constructor(status: ElevatorStatus[]) {
    this.status = status;
  }

  status: ElevatorStatus[];
}

export const elevatorsStatus = new ElevatorsStatus([new ElevatorStatus(1), new ElevatorStatus(2), new ElevatorStatus(3)]);

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

export const elevatorAnimation =  trigger('elevatorMove', [
    state('moving', style({transform: 'translateY(0)' })),
    transition('moving=> *',
      animate('2s 100ms ease-out'))
  ]);

