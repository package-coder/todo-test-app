import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-test-app';


  showArchives: boolean = false;

  toggleArchive() {
    this.showArchives = !this.showArchives
  }
}
