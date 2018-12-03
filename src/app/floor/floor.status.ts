import {Status} from '../elevator.models';

export class FloorStatus implements Status {
  number: number;
  ordered = false;
  floorHeight?: string;


  constructor(floorNumber) {
    this.number = floorNumber;
    console.log(this.number);
    this.floorHeight = (107 * this.number).toString() + 'px';
   }

  canOrder(): boolean {
    return !(this.ordered);
  }

  setFloorReached(): void {
    this.ordered = false;
    console.log(new Date());
    console.log('setting to false');

  }

  setOrder() {
    this.ordered = true;
  }
}
