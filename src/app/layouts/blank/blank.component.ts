import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavblankComponent } from "../../components/navblank/navblank.component";

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterOutlet, NavblankComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent {

}
