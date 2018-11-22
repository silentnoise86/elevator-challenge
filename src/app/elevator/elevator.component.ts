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
import {ElevatorsService} from '../elevators.service';
import {ElevatorCommand, ElevatorStatus, OrdersQueue} from '../elevator.models';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {SoundService} from '../sound.service';
import {CalcUtilService} from '../calc.util.service';


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
    private elevatorService: ElevatorsService,
    private soundService: SoundService,
    private ngZone: NgZone,
    private changeDetection: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.elevatorControl = this.elevatorService.elevatorControl;
    this.elevatorControl.subscribe(command => {
      if (command.elevatorToMove === this.elevatorNumber) {
        if (!this.occupied) {
          this.moveElevator(command.floorToMove);
        } else {

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
      this.getElevatorStatus().nextFloor = floorToMove;
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
        this.shouldMove = false;
        this.getElevatorStatus().currentFloor = this.floorOrdered;
        this.currentFloor = this.floorOrdered;
        this.getElevatorStatus().nextFloor = null;
        this.getElevatorStatus().secondsToNextFloor = 0;
        this.playAudio();
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
    return this.elevatorService.elevatorsStatus[this.elevatorNumber - 1];
  }

  private playAudio() {
    this.soundService.playAudio();
  }
  private startTimer() {
    this.moveDuration = CalcUtilService.getMoveDuration(this.currentFloor, this.floorOrdered);
    const interval = setInterval(() => {
      if (this.moveDuration) {
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
