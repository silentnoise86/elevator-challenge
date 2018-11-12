import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {
  @Input() floorNumber;

  constructor() {

  }

  ngOnInit() {
    console.log(this.floorNumber);
  }
  logHeight($event) {
    console.log($event.target.nativeElement.height);
  }

}
