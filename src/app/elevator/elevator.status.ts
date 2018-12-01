import {UtilService} from '../utilService';
import {OrdersQueue, Status} from '../elevator.models';

export class ElevatorStatus implements Status {
  number: number;
  nextFloor: number;
  available = true;
  currentFloor = 1;
  secondsToNextFloor = 0;
  orders: OrdersQueue;

  constructor(elevatorNumber: number) {
    this.number = elevatorNumber + 1;
    this.orders = new OrdersQueue();

  }

  moveElevator(floorOrdered: number) {
    if (this.orders.hasOrders() || this.nextFloor) {
      this.orders.addOrder(floorOrdered);
    } else {
      this.nextFloor = floorOrdered;
      this.startTime(floorOrdered);

    }
  }

  startTime(floorOrdered: number) {
    let moveDuration = UtilService.getMoveDuration(this.currentFloor, floorOrdered);
    const direction = this.currentFloor - floorOrdered < 0 ? 1 : -1;
    const interval =
      setInterval(() => {
        if (moveDuration) {
          moveDuration -= 0.5;
          this.currentFloor += direction;
          this.secondsToNextFloor = moveDuration + 2;
        } else {
          clearInterval(interval);
          const floorDelay = setInterval(() => {
            if (this.secondsToNextFloor) {
              this.secondsToNextFloor -= 0.5;
              console.log(this.secondsToNextFloor);
            } else {
              this.goToNextOrdered();
              clearInterval(floorDelay);
            }
          }, 500);
        }
      }, 500);

  }

  goToNextOrdered(): void {
    if (this.orders.hasOrders()) {
      this.moveElevator(this.orders.getOrder());
    } else {
      this.nextFloor = null;
    }
  }


}
