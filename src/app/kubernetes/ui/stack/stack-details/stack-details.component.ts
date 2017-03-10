import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { Logger } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { Stack } from './../../../model/stack';
import { StackAnalysesService } from '../stack-analyses.service';
import { AddWorkFlowService } from './add-work-flow.service';

import { GlobalConstants } from '../constants/constants.service';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [
    AddWorkFlowService,
    Logger,
    StackAnalysesService
  ],
  encapsulation: ViewEncapsulation.None
})
/**
 * StackDetailsComponent - Provides the detailed analysis for the given codebase 
 * by giving recommendation, overview and information about the dependencies of their packages
 * 
 * implements OnInit
 * 
 * Selector: 'stack-details'
 * Template: stack-details.component.html
 * Style: stack-details.component.scss
 * 
 * Services:
 * 1. AddWorkFlowService
 * 2. Logger
 * 3. StackAnalysesService
 * 
 * Parent component that includes,
 * 1. Recommendations
 * 2. Overview
 * 3. Components/Dependencies
 * 
 * Hits the Stack Analysis Service, gets the response
 * Passes the tailored response to each of the children.
 */
export class StackDetailsComponent implements OnInit {

  //@Input() stack: Stack;
  @Input() stack;
  @ViewChild('stackModule') modalStackModule: any;

  errorMessage: any = {};
  stackAnalysesData: Array<any> = [];
  componentAnalysesData: any = {};
  mode: string = 'Observable';

  componentDataObject: any = {};
  componentsDataTable: Array<any> = [];

  currentIndex: number = 0;

  similarStacks: Array<any> = [];
  workItemRespMsg: string = '';

  workItemData: any = {};
  multilpeActionData: any = {};

  private recommendations: Array<any> = [];
  private dependencies: Array<any> = [];
  private stackOverviewData: any = {};

  constructor(
    private addWorkFlowService: AddWorkFlowService,
    private stackAnalysesService: StackAnalysesService,
    private logger: Logger,
    private messages: GlobalConstants
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack);
    this.setStackAnalysisChartData();
  }

  /**
   * setStackAnalysisChartData - takes nothing and returns nothing
   * This function helps in setting the data that will be passed for
   * overview component
   */
  private setStackAnalysisChartData(): void {
    this.stackOverviewData = {
      dependencyChart: [
        ['internal', 11],
        ['external', 21]
      ],
      compUsageChart: [
        ['in teams', 2],
        ['in organizations', 3]
      ],
      CVEdata: ['CVE-2014-0001', 'CVE-2014-12345', 'CVE-2013-78934']
    };

    this.messages.getMessages('stackDetails').subscribe((messages) => {
      console.log(messages);
    });
  }

  /**
   * getRecommendationActions - takes nothing and returns an Array<any>
   * This function returns the static Array of objects that are to be used
   * as actions for each recommendation.
   */
  private getRecommendationActions(): Array<any> {
    return [
      {
        itemName: 'Create WorkItem',
        identifier: 'CREATE_WORK_ITEM'
      }
    ];
  }

  /**
   * setRecommendations - takes missing (Array), version (Array) and returns nothing.
   * This function gets the missing packages information and version mismatch information
   * Displays the information accordingly on screen
   */
  private setRecommendations(missing: Array<any>, version: Array<any>): void {
    this.recommendations = [];
    for (let i in missing) {
      if (missing.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Add',
          message: i + ' ' + missing[i],
          pop: this.getRecommendationActions()
        });
      }
    }

    for (let i in version) {
      if (version.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: i + ' ' + version[i],
          pop: this.getRecommendationActions()
        });
      }
    }
  }

  private setDependencies(components: Array<any>): void {
    this.dependencies = components;
  }



  /**
   * getStackAnalyses - takes an id (string) and returns nothing.
   * This hits the service and gets the response and passes it on to different functions.
   */
  private getStackAnalyses(id: string): void {
    let stackAnalysesData: any = {};
    this.stackAnalysesService
      .getStackAnalyses(id)
      .subscribe(data => {
        // Enter the actual scene only if the data is valid and the data has something inside.
        if (data && Object.keys(data).length !== 0) {
          stackAnalysesData = data;
          let result: any;
          let components: Array<any> = [];

          // Check if the data has results key
          if (stackAnalysesData.hasOwnProperty('result') && stackAnalysesData.result.length > 0) {
            result = stackAnalysesData.result[0];
            if (result.hasOwnProperty('components')) {
              components = result.components;
              // Call the stack-components with the components information so that
              // It can parse the necessary information and show relevant things.
              this.setDependencies(components);
            }

           // this.setComponentsToGrid(result);
          }

          // Check if the data has recommendation key
          if (stackAnalysesData.hasOwnProperty('recommendation')) {
            let recommendation: any = stackAnalysesData.recommendation.recommendations;
            if (recommendation) {
              this.similarStacks = recommendation.similar_stacks;
              const analysis: any = this.similarStacks[0].analysis;
              let missingPackages: Array<any> = analysis.missing_packages;
              let versionMismatch: Array<any> = analysis.version_mismatch;

              // Call the recommendations with the missing packages and version mismatches
              this.setRecommendations(missingPackages, versionMismatch);
            }
          }
        } else {
          // Set an error if the data is invalid or not proper.
          this.errorMessage.message = `This could take a while. Return to pipeline to keep
           working or stay on this screen to review progress.`;
          this.errorMessage.stack = '';
        }
      },
      error => {
        // Throw error when the service fails
        this.errorMessage.message = <any>error.message;
        this.errorMessage.stack = <any>error.stack;
      });
  }

  private showStackModal(event): void {
    this.modalStackModule.open();
    // TODO : below hack needs to be removed
    // This hack was introduced as c3's chart was not properly rendered on load
    // but on triggering some random changes works fine
    // setTimeout(() => {
    //   window.dispatchEvent(new Event('resize'));
    // }, 100);
  }

}
