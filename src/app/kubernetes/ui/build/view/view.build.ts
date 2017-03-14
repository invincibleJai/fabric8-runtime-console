import {Input, Component} from "@angular/core";
import {Build} from "../../../model/build.model";

@Component({
  selector: 'fabric8-build-view',
  templateUrl: './view.build.html',
  styleUrls: ['./view.build.scss'],
})
export class BuildViewComponent {

  @Input() build: Build;
  public codebases = [{name: 'Pllm', uuid: 'ff59ea91cf264003bc6dc12621c91205'},
                     {name: 'Pllm2', uuid: 'ff59ea91cf264003bc6dc12621c91205'}];
}
