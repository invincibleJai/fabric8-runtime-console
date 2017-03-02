import { Component, OnInit } from '@angular/core';

import { Stack } from '../../../model/stack';


@Component({
  selector: 'alm-stack',
  templateUrl: './stack-overview.component.html',
  styleUrls: ['./stack-overview.component.scss']
})
export class StackOverviewComponent implements OnInit {

  private collapsed: Map<Stack, Boolean>;

  constructor(
    ) {
    this.collapsed = new Map();
  }

  ngOnInit() {

  }

}
