import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ElevatorService} from '../elevatorService';
import {ElevatorCommand, ElevatorStatus} from '../ElevatorModels';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {ChangeDetection} from '@angular/cli/lib/config/schema';


@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss'],
  animations: [trigger('elevatorMove', [
    state('moving', style({transform: `{{distanceToMove}}`}), {params: {distanceToMove: 'translateY(0)'}}),
    transition('*=> moving',
      animate('4s 100ms ease-out'))
  ])]
})


export class ElevatorComponent implements OnInit, AfterViewInit {
  @Input() elevatorNumber: number;
  @ViewChild('elevatorElm') elevatorElm: ElementRef;
  elevatorControl: Subject<ElevatorCommand>;
  floorOrdered: number;
  currentFloor = 1;
  floorToReach = 0;
  floorheight = 114;
  distanceToMove = 'translateY(0)';
  shouldMove = false;

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
        console.log(command);
        this.moveElevator(command.floorToMove);
      }
    });
  }

  ngAfterViewInit() {

  }

  private moveElevator(floorToMove: number) {
    this.changeDetection.detectChanges();
    this.ngZone.run(() => {
        console.log('move elevator called with' + floorToMove);
        if (this.isElevatorAvailable()) {
          console.log(`elevator ${this.elevatorNumber} called to floor ${floorToMove} its current floor is ${this.currentFloor}`);
          this.floorOrdered = floorToMove;
          const direction = this.currentFloor - this.floorOrdered < 0 ? 1 : -1;
          console.log(this.currentFloor);
          this.distanceToMove = `translateY(${this.floorheight * (1 - this.floorOrdered)}px)`;
          console.log(this.distanceToMove);
          this.shouldMove = true;
        }
      }, this, [floorToMove]
    );
    this.changeDetection.detectChanges();

  }

  onFloorReached(event: AnimationEvent) {
    this.ngZone.run(() => {
      if (event.fromState === 'static') {
        console.log('static called for elevator' + this.elevatorNumber);
        this.shouldMove = false;
        this.getElevatorStatus().currentFloor = this.floorOrdered;
        this.currentFloor = this.floorOrdered;
        this.elevatorControl.next({isAvailable: this.elevatorNumber, floorToMove: this.currentFloor});
        console.log(this.elevatorService.elevatorsStatus.status);
      }
      if (event.toState === 'moving' && this.floorOrdered === 5 && this.elevatorNumber === 1) {
        console.log('here');
        console.log('distance to move', this.distanceToMove);
        console.log('should move', this.shouldMove);
      }
    }, this, [event]);


  }

  private isElevatorAvailable(): boolean {
    return this.getElevatorStatus().available;
  }

  private getElevatorStatus(): ElevatorStatus {
    return this.elevatorService.elevatorsStatus.status[this.elevatorNumber - 1];
  }

  logEvent($event: AnimationEvent) {
    console.log($event);

  }

  calcFloorHeight() {
    return;
  }
}
