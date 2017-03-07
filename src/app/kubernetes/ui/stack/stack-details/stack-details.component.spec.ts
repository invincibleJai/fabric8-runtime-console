/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, Http } from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { AuthenticationService } from 'ngx-login-client';

import { Stack } from '../../../models/stack';
import { StackDetailsComponent } from './stack-details.component';
import { RecommenderModule } from '../recommender/recommender.module';
import { OverviewModule } from '../overview/overview.module';

import { StackComponentsModule } from '../stack-components/stack-components.module';
import { recommenderApiUrlProvider } from './../../../shared/recommender-api.provider';
import { ApiLocatorService } from './../../../shared/api-locator.service';
import { witApiUrlProvider } from './../../../shared/wit-api.provider';
import { GlobalConstants } from '../constants/constants.service';

describe('StackDetailsComponent', () => {
  let component: StackDetailsComponent;
  let fixture: ComponentFixture<StackDetailsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    let fakeAuthService: any = {
      getToken: function () {
        return '';
      },
      isLoggedIn: function () {
        return true;
      }
    };
    TestBed.configureTestingModule({
      imports: [
        ModalModule,
        RecommenderModule,
        OverviewModule,
        StackComponentsModule,
        HttpModule
      ],
      declarations: [StackDetailsComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        witApiUrlProvider,
        recommenderApiUrlProvider,
        ApiLocatorService,
        GlobalConstants
      ]
    })
      .compileComponents();
  }));

  it('Component has to be present', () => {
    fixture = TestBed.createComponent(StackDetailsComponent);
    component = fixture.componentInstance;
    let stack: Stack = new Stack();
    stack.uuid = '2ec2749ef0711bad2112ef45c2a5ee47bd32a6e4';
    component.stack = stack;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackDetailsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    let stack: Stack = new Stack();
    stack.uuid = '2ec2749ef0711bad2112ef45c2a5ee47bd32a6e4';
    component.stack = stack;
    fixture.detectChanges();
  });

  it('On click should open the modal', async(() => {
    let stackComponent: any = fixture.componentInstance;
    spyOn(stackComponent, 'showStackModal');
    let button: any = debugElement.nativeElement.querySelector('.stack-reports-btn');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(stackComponent.showStackModal).toHaveBeenCalled();
    });
  }));
});
