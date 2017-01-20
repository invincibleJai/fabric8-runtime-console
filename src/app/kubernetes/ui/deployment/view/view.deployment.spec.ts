/* tslint:disable:no-unused-variable */
import {async, TestBed, ComponentFixture} from "@angular/core/testing";
import {DeploymentViewComponent} from "./view.deployment";
import {MomentModule} from "angular2-moment";
import {EntriesPipe} from "../../../view/entries.pipe";
import {DeploymentScaleDialog} from "../scale-dialog/scale-dialog.deployment";
import {DeploymentDeleteDialog} from "../delete-dialog/delete-dialog.deployment";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {KuberentesStoreModule} from "../../../kubernetes.store.module";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {RestangularModule} from "ng2-restangular";

describe('DeploymentViewComponent', () => {
  let deployment: DeploymentViewComponent;
  let fixture: ComponentFixture<DeploymentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          FormsModule,
          MomentModule,
          ModalModule,
          KuberentesStoreModule,
          RestangularModule.forRoot(),
        ],
        declarations: [
          DeploymentViewComponent,
          DeploymentDeleteDialog,
          DeploymentScaleDialog,
          EntriesPipe,
        ],
      providers: [
        MockBackend,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          }, deps: [MockBackend, RequestOptions],
        },
      ]
      }
    )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentViewComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(deployment).toBeTruthy();
  });
});
