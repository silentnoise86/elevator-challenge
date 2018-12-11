import {UtilService} from '../utilService';
import {OrdersQueue, Status} from '../elevator.models';
import {Subject} from 'rxjs';

export class ElevatorStatus implements Status {
  number: number;
  nextFloor: number;
  available = true;
  currentFloor = 1;
  secondsToNextFloor = 0;
  orders: OrdersQueue;
  isWaitingOnFloor = false;
  $floorCommandSubject: Subject<number>;

  constructor(elevatorNumber: number, subject: Subject<number>) {
    this.number = elevatorNumber;
    this.orders = new OrdersQueue();
    this.$floorCommandSubject = subject;

  }

  moveElevator(floorOrdered: number) {
    if (this.nextFloor) {
      this.orders.addOrder(floorOrdered);
    } else {
      this.available = false;
      this.nextFloor = floorOrdered;
      this.startTime(floorOrdered);

    }
  }

  startTime(floorOrdered: number) {
    this.secondsToNextFloor = UtilService.getMoveDuration(this.currentFloor, floorOrdered);
    const direction = this.currentFloor - floorOrdered < 0 ? 1 : -1;

    const interval =
      setInterval(() => {
        if (this.secondsToNextFloor) {
          this.secondsToNextFloor -= 0.5;
          this.currentFloor += direction;
          if (this.secondsToNextFloor === 0) {
            this.$floorCommandSubject.next(this.currentFloor);
            this.isWaitingOnFloor = true;
            clearInterval(interval);
            let delayDuration = 2;
            const floorDelay = setInterval(() => {
              if (delayDuration) {
                delayDuration -= 0.5;
                if (delayDuration === 0) {
                  this.available = true;
                  this.isWaitingOnFloor = false;
                  this.$floorCommandSubject.next(-this.currentFloor);
                  this.goToNextOrdered();
                  clearInterval(floorDelay);
                }
              }
            }, 500);
          }
        }
      }, 500);

  }

  goToNextOrdered(): void {
    this.nextFloor = null;
    if (this.orders.hasOrders()) {
      this.moveElevator(this.orders.getOrder());
    } else {
      this.nextFloor = null;
    }
  }


}
