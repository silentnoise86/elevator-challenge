import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  floors: number[];
  elevators: number[];

  constructor(

  ) {
    this.floors = this.createNumArray(50);
    this.elevators = this.createNumArray(3);
  }

  ngOnInit() {

  }

  createNumArray(num: number) {
    return Array(num).fill(num).map((x, i) => i);
  }


}
