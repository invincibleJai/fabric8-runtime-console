import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Logger } from 'ngx-login-client';

import { Stack } from '../../../model/stack';
import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';
import { RenderNextService } from './render-next-service';
import { AddWorkFlowService } from './add-work-flow.service';
import { PagerService } from '../pager.service';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.scss'],
  providers: [AddWorkFlowService,
    Logger,
    PagerService,
    RenderNextService,
    StackAnalysesService,
    StackAnalysesModel],
  encapsulation: ViewEncapsulation.None
})

export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;
  @ViewChild('workItemRespModal') modal: any;
  @ViewChild('stackModule') modalStackModule: any;

  errorMessage: any = {};
  stackAnalysesData: Array<any> = [];
  componentAnalysesData: any = {};
  mode = 'Observable';

  requiredEngines = {};
  requiredEnginesArr = [];

  componentDataObject = {};
  componentsDataTable = [];

  currentStackRows: Array<any> = [];
  currentStackHeaders: Array<string> = [];

  recoArray: Array<any> = [];
  currentIndex: number = 0;

  similarStacks: Array<any> = [];
  workItemRespMsg: string = '';

  workItemData: any = {};
  multilpeActionData: any = {};
  multiRecommendMsg: string = '';

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  public recommendationForm = this.fb.group({
    row: ["[{name: 'Sample1', version: '0.1.1', custom: '{name: 'Add'}'}]"]
  });

  private stackAnalysisRawData: any = {};

  private recommendations: Array<any> = [];

  private dependencies: Array<any> = [];

  private stackOverviewData: any = {};


  constructor(
    public fb: FormBuilder,
    private stackAnalysesService: StackAnalysesService,
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);
    this.setStackAnalysisRawData();

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

    // initialize to page 1
    // this.setPage(1);

    this.currentStackHeaders = [
      'name',
      'version',
      'action'
    ];

    this.currentStackRows = [
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' },
      { name: 'Sample1', version: '0.1.1' }
    ];

    this.recoArray = [
      {
        'headers': [
          'Name',
          'Version',
          'Action'
        ],
        'rows': [
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' },
          { name: 'Sample1', version: '0.1.1' }
        ]
      }
    ];
  }

  private setStackAnalysisRawData(): void {
    this.stackAnalysisRawData = {
      packageName: '',
      packageVersion: '',
      averageUsage: 'NA',
      lowPublicUsageComponents: 'NA',
      redhatDistributedComponents: 'NA',
      averageStars: '',
      averageForks: '',
      lowPopularityComponents: '',
      distinctLicenses: '',
      totalLicenses: '',
      totalSecurityIssues: 'NA',
      cvss: 'NA',
      componentsWithTests: 'NA',
      componentsWithDependencyLockFile: 'NA'
    };
  }


  /* Adding Single Work item */

  private setRecommendations(missing: Array<any>, version: Array<any>): void {
    this.recommendations = [];
    for (let i in missing) {
      if (missing.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Add',
          message: i + ' ' + missing[i],
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        });
      }
    }

    for (let i in version) {
      if (version.hasOwnProperty(i)) {
        this.recommendations.push({
          suggestion: 'Recommended',
          action: 'Upgrade',
          message: i + ' ' + version[i],
          pop: [
            {
              itemName: 'Create WorkItem',
              identifier: 'CREATE_WORK_ITEM'
            }, {
              itemName: 'Dismiss Recommendation',
              identifier: 'DISMISS'
            }, {
              itemName: 'Restore Recommendation',
              identifier: 'RESTORE'
            }
          ]
        });
      }
    }
  }

  private setDependencies(components: Array<any>): void {
    this.dependencies = components;
  }


  private getComponents(components): void {
    this.currentStackRows = [];
    for (let component in components) {
      if (components.hasOwnProperty(component)) {
        this.currentStackRows.push({
          name: components[component].name,
          version: components[component].version
        });
      }
    }
  }

  private setComponentsToGrid(stackData: any): void {
    let components: Array<any> = stackData.components;
    let length: number = components.length;
    for (let i = 0; i < length; i++) {
      let myObj: any = {};
      myObj.ecosystem = components[i].ecosystem;
      myObj.pkg = components[i].name;
      myObj.version = components[i].version;
      myObj.latestVersion = components[i].latest_version;
      myObj.publicUsage = components[i].dependents_count;
      myObj.relativePublicUsage = components[i].relative_usage;
      myObj.popularity = '';
      if (components[i].github_details.forks_count) {
        myObj.popularity = components[i].github_details.forks_count;
      }
      if (components[i].github_details.stargazers_count) {
        myObj.popularity += '/'
          + components[i].github_details.stargazers_count;
      }

      myObj.redhatUsage = '';
      myObj.licence = components[i].licenses[0];
      this.componentsDataTable.push(myObj);
    }
  }

  private setStackMetrics(stackData: any): void {
    this.stackAnalysisRawData.packageName = stackData.name;
    this.stackAnalysisRawData.packageVersion = stackData.version;

    if (stackData.usage) {
      this.stackAnalysisRawData.averageUsage = stackData.usage.average_usage;
      this.stackAnalysisRawData.lowPublicUsageComponents
        = stackData.usage.low_public_usage_components;
      this.stackAnalysisRawData.redhatDistributedComponents
        = stackData.usage.redhat_distributed_components;
    }
    this.stackAnalysisRawData.averageStars = stackData.popularity.average_stars;
    this.stackAnalysisRawData.averageForks = stackData.popularity.average_forks;

    this.stackAnalysisRawData.lowPopularityComponents
      = stackData.popularity.low_popularity_components;

    this.stackAnalysisRawData.distinctLicenses = stackData.distinct_licenses;
    this.stackAnalysisRawData.totalLicenses = stackData.total_licenses;

    if (stackData.total_security_issues)
      this.stackAnalysisRawData.totalSecurityIssues = stackData.total_security_issues;

    if (stackData.cvss)
      this.stackAnalysisRawData.cvss = stackData.cvss;

    if (stackData.metadata) {
      this.stackAnalysisRawData.componentsWithTests = stackData.metadata.components_with_tests;
      this.stackAnalysisRawData.componentsWithDependencyLockFile
        = stackData.metadata.components_with_dependency_lock_file;

      this.stackAnalysisRawData.requiredEngines = stackData.metadata.required_engines;
    }

    for (let key in this.requiredEngines) {
      if (this.requiredEngines.hasOwnProperty(key)) {
        this.requiredEnginesArr.push({ key: key, value: this.requiredEngines[key] });
      }
    }
  }

  private getStackAnalyses(id: string) {
    let stackAnalysesData: any = {};
    this.stackAnalysesService
      .getStackAnalyses(id)
      .subscribe(data => {
        if (data && Object.keys(data).length !== 0) {
          stackAnalysesData = data;
          let result: any;
          let components: Array<any> = [];

          if (stackAnalysesData.hasOwnProperty('result') && stackAnalysesData.result.length > 0) {
            result = stackAnalysesData.result[0];
            if (result.hasOwnProperty('components')) {
              components = result.components;
              this.getComponents(components);
              // Call the stack-components with the components information so that
              // It can parse the necessary information and show relevant things.
              this.setDependencies(components);
            }

            this.setStackMetrics(result);
            this.setComponentsToGrid(result);
          }
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
          this.errorMessage.message = `This could take a while. Return to pipeline to keep
           working or stay on this screen to review progress.`;
          this.errorMessage.stack = '';
        }
      },
      error => {
        this.errorMessage.message = <any>error.message;
        this.errorMessage.stack = <any>error.stack;
      }
      );
  }


  // make workitem api call with multiple recommendation //

  public showStackModal(event): void {
    this.modalStackModule.open();
    // TODO : below hack needs to be removed
    // This hack was introduced as c3's chart was not properly rendered on load
    // but on triggering some random changes works fine

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

}
