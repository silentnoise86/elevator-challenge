import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {UtilService} from './utilService';
import {map, tap} from 'rxjs/operators';
import {ElevatorStatus} from './elevator/elevator.status';
import {FloorStatus} from './floor/floor.status';


@Injectable({
  providedIn: 'root',
})
export class ElevatorsService implements OnDestroy {

  $elevatorCommandSubject = new Subject<number>();
  $floorCommandSubject = new Subject<number>();
  $elevatorsStatus: BehaviorSubject<ElevatorStatus[]>;
  $floorStatus: BehaviorSubject<FloorStatus[]>;
  elevatorsNum = 3;
  floorsNum = 40;
  subscriptions: Subscription[] = [];

  constructor() {
    this.initSubscriptions();
  }

  private initStatus(statusType: any, count: number): BehaviorSubject<any[]> {
    return new BehaviorSubject((UtilService.createNumArray(count).map(num => new statusType(num + 1, this.$floorCommandSubject))
    ));

  }


  private calcTotalTimeFromFloor(floor: number, status: ElevatorStatus) {
    const allOrders = [...status.orders.orders];
    const timeTillCurrentNextFloor = status.secondsToNextFloor ? status.secondsToNextFloor + 2 :
      status.isWaitingOnFloor ? status.onFloorDelay : 0;
    const allOrdersReduced = allOrders.length ? allOrders.map((elevatorStatus, index, array) => (array[index + 1] ?
      Math.abs(elevatorStatus - array[index + 1]) / 2 + 2 : 0)).reduce((a, b) => a + b) : 0;
    const floorToReachFrom = allOrders.length ? allOrders[allOrders.length - 1] : status.nextFloor ? status.nextFloor : status.currentFloor;
    return timeTillCurrentNextFloor + allOrdersReduced + this.getDistanceFromFloorOrdered(floorToReachFrom, floor);
  }

  updateFloorOrder($event: number) {
    if (!this.isElevatorOnFloor($event)) {
      this.$elevatorCommandSubject.next($event);
    }
  }

  updateFloorReached($event: number) {
    this.$floorCommandSubject.next($event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  private initElevatorCommandSubscription(): Subscription {
    return this.$elevatorCommandSubject.pipe(
      map(number => {
        this.updateFloorsOrderToStatus(this.$floorStatus.value, number);
        return number;
      }),
      tap(number => {
        this.updateElevatorsStatus(this.$elevatorsStatus.value, number);
      })
    ).subscribe();
  }

  private initFloorCommandSubscription(): Subscription {
    return this.$floorCommandSubject.pipe(
      tap(number => {
        this.updateFloorReachedToStatus(this.$floorStatus.value, number);
      })
    ).subscribe();
  }

  private initSubscriptions(): void {
    this.$elevatorsStatus = this.initStatus(ElevatorStatus, this.elevatorsNum);
    this.$floorStatus = this.initStatus(FloorStatus, this.floorsNum);
    this.subscriptions.push(this.initElevatorCommandSubscription());
    this.subscriptions.push(this.initFloorCommandSubscription());
  }

  private getClosestElevator(floorNumber: number, elevatorsStatus: ElevatorStatus[]) {
    return elevatorsStatus.map(status => {
      return {elevatorNumber: status.number, timeFromFloor: this.calcTotalTimeFromFloor(floorNumber, status)};
    }).reduce((a, b) => a.timeFromFloor > b.timeFromFloor ? b : a);
  }


  private updateFloorsOrderToStatus(status: FloorStatus[], floorNumber: number) {
    status[floorNumber - 1].ordered = true;
  }

  private updateFloorReachedToStatus(allFloorStatus: FloorStatus[], floorReached: number): void {
    if (floorReached > 0) {
      allFloorStatus[floorReached - 1].setFloorReached();
    } else {
      allFloorStatus[-floorReached - 1].setExitTimeOut();
    }
  }

  private updateElevatorsStatus(elevatorsStatus: ElevatorStatus[], number: number): void {
    const closestElevator = elevatorsStatus[this.getClosestElevator(number, elevatorsStatus).elevatorNumber - 1];
    closestElevator.moveElevator(number);
  }


  private isElevatorOnFloor(floorNumber: number): boolean {
    return !!this.$elevatorsStatus.value.find(elevator => elevator.currentFloor === floorNumber &&
      (elevator.available || elevator.isWaitingOnFloor));
  }

  private getDistanceFromFloorOrdered(currentFloor: number, floorOrdered: number): number {
    return Math.abs(currentFloor - floorOrdered) / 2;
  }

}

