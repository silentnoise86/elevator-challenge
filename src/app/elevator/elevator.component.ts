import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {Subject} from 'rxjs';
import {ElevatorService} from '../elevatorService';
import {ElevatorCommand, ElevatorStatus, OrdersQueue} from '../ElevatorModels';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';


@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss'],
  animations: [trigger('elevatorMove', [
    state('moving', style({transform: `{{distanceToMove}}`}), {params: {distanceToMove: 'translateY(0)'}}),
    transition('*=> moving',
      animate('{{ time }}'), {params: {time: '0.5s'}}),

  ])]
})


export class ElevatorComponent implements OnInit {
  @Input() elevatorNumber: number;
  @ViewChild('elevatorElm') elevatorElm: ElementRef;
  elevatorControl: Subject<ElevatorCommand>;
  floorOrdered: number;
  currentFloor = 1;
  floorHeight = 114;
  distanceToMove = 'translateY(0)';
  shouldMove = false;
  occupied = false;
  time = '4s';
  moveDuration = 0;
  orders = new OrdersQueue();

  constructor(
    private elevatorService: ElevatorService,
    private ngZone: NgZone,
    private changeDetection: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.elevatorControl = this.elevatorService.elevatorControl;
    this.elevatorControl.subscribe(command => {
      if (command.elevatorToMove === this.elevatorNumber) {
        console.log(`elevator ${this.elevatorNumber} recieved order to floor ${command.floorToMove}`);
        if (!this.occupied) {
          console.log(`moving elevator ${this.elevatorNumber}`)
          this.moveElevator(command.floorToMove);
        } else {
          console.log(`elevator ${this.elevatorNumber} adding to queue`);
          this.getElevatorStatus().orders.addOrder(command.floorToMove);
          console.log(this.getElevatorStatus().orders.orders);
        }
      }
    });
  }

  private moveElevator(floorToMove: number) {
    this.changeDetection.detectChanges();
    this.ngZone.run(() => {
          this.floorOrdered = floorToMove;
          this.distanceToMove = `translateY(${this.floorHeight * (1 - this.floorOrdered)}px)`;
          this.time = `${Math.abs(this.currentFloor - this.floorOrdered) * 0.5}s`;
          this.startTimer();
          this.shouldMove = true;
          this.occupied = true;
      }, this, [floorToMove]
    );
    this.changeDetection.detectChanges();

  }

  onFloorReached(event: AnimationEvent) {
    this.ngZone.run(() => {
      if (event.fromState === 'static') {
        console.log('should move', this.shouldMove);
        this.shouldMove = false;
        this.getElevatorStatus().currentFloor = this.floorOrdered;
        this.currentFloor = this.floorOrdered;
        setTimeout(() => {
          this.occupied = false;
          let isAvailable = false;
          if (this.getElevatorStatus().orders.orders.length) {
            this.moveElevator(this.getElevatorStatus().orders.getOrder());
            isAvailable = true;
          }
          this.elevatorControl.next({elevatorReporting: this.elevatorNumber,
            floorToMove: this.currentFloor, isAvailable: isAvailable});
        }, 2000);
      }
    }, this, [event]);
  }

  private getElevatorStatus(): ElevatorStatus {
    console.log(this.elevatorService.elevatorsStatus[this.elevatorNumber - 1]);
    return this.elevatorService.elevatorsStatus[this.elevatorNumber - 1];
  }

  private startTimer() {
    this.moveDuration = Math.abs(this.currentFloor - this.floorOrdered) / 2;
    const interval = setInterval(() => {
      if (this.moveDuration > 0) {
        this.moveDuration -= 0.5;
        this.getElevatorStatus().secondsToNextFloor = this.moveDuration + 2;
      } else {
        clearInterval(interval);
        const floorDelay = setInterval(() => {
          if (this.getElevatorStatus().secondsToNextFloor) {
            this.getElevatorStatus().secondsToNextFloor -= 0.5;
          } else {
            clearInterval(floorDelay);
          }
        }, 500);
      }
    }, 500);
  }
}
