import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {ModalModule} from "ng2-modal";
import {EventsListPage} from "./list-page/list-page.event";
import {EventsListToolbarComponent} from "./list-toolbar/list-toolbar.event";
import {EventsListComponent} from "./list/list.event";
import {EventViewPage} from "./view-page/view-page.event";
import {EventViewWrapperComponent} from "./view-wrapper/view-wrapper.event";
import {EventViewToolbarComponent} from "./view-toolbar/view-toolbar.event";
import {EventViewComponent} from "./view/view.event";
import {Fabric8CommonModule} from "../../../common/common.module";
import {MomentModule} from "angular2-moment";
import {KubernetesComponentsModule} from "../../components/components.module";

const routes: Routes = [
  { path: '', component: EventsListPage },
  { path: ':id', component: EventViewPage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(routes),
    Fabric8CommonModule,
    KubernetesComponentsModule,
  ],
  declarations: [
    EventsListPage,
    EventsListToolbarComponent,
    EventsListComponent,
    EventViewPage,
    EventViewWrapperComponent,
    EventViewToolbarComponent,
    EventViewComponent,
  ],
  exports: [
    ModalModule,
  ],
})
export class EventModule {
}
