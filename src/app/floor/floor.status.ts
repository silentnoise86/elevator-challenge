import {Status} from '../elevator.models';

export class FloorStatus implements Status {
  number: number;
  ordered = false;
  floorHeight?: string;
  elevatorArrived = false;

  constructor(floorNumber) {
    this.number = floorNumber;
    this.floorHeight = (107 * this.number).toString() + 'px';
  }

  canOrder(): boolean {
    return !(this.ordered);
  }

  setFloorReached(): void {
    this.ordered = false;
    this.elevatorArrived = true;

  }

  setExitTimeOut() {
    this.elevatorArrived = false;
  }

  setOrder() {
    this.ordered = true;
  }
}
