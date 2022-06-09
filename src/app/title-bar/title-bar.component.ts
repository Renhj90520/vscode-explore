import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.less'],
})
export class TitleBarComponent implements OnInit {
  isWindowMaximized = false;
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (window['api']) {
      window['api'].on('window-state', (event, state) => {
        this.ngZone.run(() => {
          this.isWindowMaximized = state;
        });
      });

      window['api'].send('get-window-state');
    }
  }
  minimizeWidow() {
    if (window['api']) {
      window['api'].send('minimize-window');
    }
  }
  toggleMaximizeWindow() {
    if (window['api']) {
      window['api'].send('toggle-window-maximize');
    }
  }
  closeWindow() {
    if (window['api']) {
      window['api'].send('close-window');
    }
  }
}
