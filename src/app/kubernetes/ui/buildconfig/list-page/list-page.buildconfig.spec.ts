/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {BuildConfigsListPage} from "./list-page.buildconfig";
import {BuildConfigsListComponent} from "../list/list.buildconfig";
import {BuildConfigsListToolbarComponent} from "../list-toolbar/list-toolbar.buildconfig";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {ModalModule} from "ng2-modal";
import {MomentModule} from "angular2-moment";
import {BuildConfigDeleteDialog} from "../delete-dialog/delete-dialog.buildconfig";
import {BuildConfigScaleDialog} from "../scale-dialog/scale-dialog.buildconfig";
import {FormsModule} from "@angular/forms";

describe('BuildConfigsListPage', () => {
  let component: BuildConfigsListPage;
  let fixture: ComponentFixture<BuildConfigsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        FormsModule,
        MomentModule,
        ModalModule,
        KubernetesStoreModule,
      ],
      declarations: [
        BuildConfigsListPage,
        BuildConfigsListComponent,
        BuildConfigsListToolbarComponent,
        BuildConfigDeleteDialog,
      ],
      providers: [
        MockBackend,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          }, deps: [MockBackend, RequestOptions],
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildConfigsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
