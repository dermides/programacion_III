import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar";
import { UiToastComponent } from './components/ui-toast/ui-toast'; // <--- Importar

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, UiToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Papel Shop');
}
