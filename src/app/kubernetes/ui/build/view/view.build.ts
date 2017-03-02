import {Input, Component} from "@angular/core";
import {Build} from "../../../model/build.model";

@Component({
  selector: 'fabric8-build-view',
  templateUrl: './view.build.html',
  styleUrls: ['./view.build.scss'],
})
export class BuildViewComponent {

  @Input() build: Build;
  public codebases = [{name: 'Pllm', uuid: '8950acb76bc84235873d73d149cb9f61'},
                     {name: 'Pllm2', uuid: '8950acb76bc84235873d73d149cb9f61'}];
}
