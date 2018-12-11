import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, pipe, Subject, Subscription} from 'rxjs';
import {UtilService} from './utilService';
import {delay, map, tap, timeout} from 'rxjs/operators';
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
    const distanceFromFloorOrdered = status.nextFloor ? Math.abs(status.nextFloor - floor) / 2 : Math.abs(status.currentFloor - floor) / 2;
    const timeTillCurrentNextFloor = status.secondsToNextFloor ? status.secondsToNextFloor : 0;
    const allOrdersReduced = allOrders.length ? allOrders.map((elevatorStatus, index, array) => (array[index + 1] ?
      Math.abs(elevatorStatus - array[index + 1]) / 2 + 2 : 0)).reduce((a, b) => a + b) : 0;
    return timeTillCurrentNextFloor + allOrdersReduced + distanceFromFloorOrdered;
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

  private initFloorCommanSubscription(): Subscription {
    return this.$floorCommandSubject.pipe(
      tap(number => {
        console.log(new Date().getTime());
        this.updateFloorReachedToStatus(this.$floorStatus.value, number);
      })
    ).subscribe();
  }

  private initSubscriptions(): void {
    this.$elevatorsStatus = this.initStatus(ElevatorStatus, this.elevatorsNum);
    this.$floorStatus = this.initStatus(FloorStatus, this.floorsNum);
    this.subscriptions.push(this.initElevatorCommandSubscription());
    this.subscriptions.push(this.initFloorCommanSubscription());
  }

  private getClosestElevator(floorNumber: number, elevatorsStatus: ElevatorStatus[]): ElevatorStatus {
    return elevatorsStatus.find(status => {
      return status.number === 1;
    });
  }

  private updateFloorsOrderToStatus(status: FloorStatus[], floorNumber: number) {
    const result = [...status];
    status[floorNumber - 1].ordered = true;
  }

  private updateFloorReachedToStatus(allFloorStatus: FloorStatus[], floorReached: number) {
    allFloorStatus[floorReached - 1].setFloorReached();
  }

  private updateElevatorsStatus(value: ElevatorStatus[], number: number): void {
    const closestElevator = this.getClosestElevator(number, value);

    closestElevator.moveElevator(number);
  }


  private isElevatorOnFloor(floorNumber: number): boolean {
    return !!this.$elevatorsStatus.value.find(elevator => elevator.currentFloor === floorNumber &&
      (elevator.available || elevator.isWaitingOnFloor));
  }
}

