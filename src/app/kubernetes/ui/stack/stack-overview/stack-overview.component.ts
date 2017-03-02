import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Stack } from '../../../model/stack';


@Component({
  selector: 'alm-stack',
  templateUrl: './stack-overview.component.html',
  styleUrls: ['./stack-overview.component.scss']
})
export class StackOverviewComponent implements OnInit {

  private collapsed: Map<Stack, Boolean>;
  stacks = [{ codebase: 'codebase1', uuid: '8950acb76bc84235873d73d149cb9f61' },
            { codebase: 'codebase1', uuid: '8950acb76bc84235873d73d149cb9f61' }];
  constructor(
  ) {
    this.collapsed = new Map();
  }

  ngOnInit() {

  }

}
