import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subject} from 'rxjs';
import {ElevatorService} from '../elevatorService';
import {ElevatorCommand, ElevatorStatus} from '../ElevatorModels';
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


export class ElevatorComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() elevatorNumber: number;
  @ViewChild('elevatorElm') elevatorElm: ElementRef;
  elevatorControl: Subject<ElevatorCommand>;
  floorOrdered: number;
  currentFloor = 1;
  floorheight = 114;
  distanceToMove = 'translateY(0)';
  shouldMove = false;
  time = '4s';
  moveDuration = 0;

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
        this.moveElevator(command.floorToMove);
      }
    });
  }

  ngOnChanges(event: SimpleChanges) {
    console.log(event);
  }
  ngAfterViewInit() {

  }

  private moveElevator(floorToMove: number) {
    this.changeDetection.detectChanges();
    this.ngZone.run(() => {
        if (this.isElevatorAvailable()) {
          this.floorOrdered = floorToMove;
          const direction = this.currentFloor - this.floorOrdered < 0 ? 1 : -1;
          this.distanceToMove = `translateY(${this.floorheight * (1 - this.floorOrdered)}px)`;
          this.time = `${Math.abs(this.currentFloor - this.floorOrdered) * 0.5}s`;
          this.startTimer();
          this.shouldMove = true;
        }
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
        setTimeout(() => {
          this.elevatorControl.next({isAvailable: this.elevatorNumber, floorToMove: this.currentFloor});
        }, 2000);
      }
    }, this, [event]);


  }

  private isElevatorAvailable(): boolean {
    return this.getElevatorStatus().available;
  }

  private getElevatorStatus(): ElevatorStatus {
    return this.elevatorService.elevatorsStatus.status[this.elevatorNumber - 1];
  }

  private startTimer() {
    this.moveDuration = Math.abs(this.currentFloor - this.floorOrdered);

    const interval = setInterval(() => {
      if (this.moveDuration) {
        this.moveDuration--;
      } else {
        clearInterval(interval);
      }
    }, 500);
  }
}
