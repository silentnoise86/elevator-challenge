import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, Output,
  SimpleChanges
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ElevatorStatus} from './elevator.status';


@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss'],
  animations: [trigger('elevatorMove', [
    state('moving', style({transform: `{{distanceToMove}}`}), {params: {distanceToMove: 'translateY(0)'}}),
    transition('*=> moving',
      animate('{{ time }}'), {params: {time: '0.5s'}}),

  ])],
  changeDetection: ChangeDetectionStrategy.OnPush

})


export class ElevatorComponent implements OnChanges {
  @Output() floorReached: EventEmitter<number> = new EventEmitter();
  @Input() status: ElevatorStatus;
  @Input() nextFloor: number;
  @Input() moveDuration: number;

  // elevatorNumber: number;
  // floorOrdered: number;
  // currentFloor = 1;
  floorHeight = 114;
  distanceToMove = 'translateY(0)';
  shouldMove = false;
  time = '4s';


  constructor(
    private  changeDetection: ChangeDetectorRef
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isElevatorOrder(changes)) {
      this.moveElevator(this.nextFloor);
    }

  }


  private moveElevator(floorToMove: number) {

    this.distanceToMove = `translateY(${this.floorHeight * (1 - floorToMove)}px)`;
    this.time = `${Math.abs(this.status.currentFloor - floorToMove) * 0.5}s`;
    console.log(this.time);
    this.shouldMove = true;
    this.changeDetection.detectChanges();
  }

  onFloorReached(event: any) {
    if (event.fromState === 'static') {
      this.shouldMove = false;

    }
  }

  private isElevatorOrder(changes: SimpleChanges): boolean {
    return changes.nextFloor && !changes.nextFloor.firstChange && (changes.nextFloor.currentValue || changes.nextFloor.currentValue === 0);
  }

}
