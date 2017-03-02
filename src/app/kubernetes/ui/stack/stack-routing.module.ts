import { StackOverviewComponent } from './stack-overview/stack-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StackComponent } from './stack.component';

const routes: Routes = [
 {
    path: '',
    component: StackComponent,
    children: [
      {
        path: '',
        component: StackOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StackRoutingModule { }
