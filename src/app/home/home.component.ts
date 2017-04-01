import {
  Component,
  OnInit
} from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  // Set our default values
  private static readonly DEFAULT_STATE = {type: 'Car', mudInBed: false,
  bedLetDown: false, licensePlate: '', visits: 1, summary: ''}
  public localState = Object.assign({}, HomeComponent.DEFAULT_STATE)
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title,
  ) {
  }

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  private calcPrice() {
    const {mudInBed, type, visits} = this.localState;
    return ((type == 'Car' ? 5 : 10) * (visits == 2 ? .5 : 1)) +
        ((type == 'Truck' && mudInBed == true) ? 2 : 0)
  }

  public isValid() {
    const {type, licensePlate, bedLetDown} = this.localState;
    return licensePlate != '1111111' &&
        (type != 'Truck' || bedLetDown == false);
  }

  public submitState(value: string) {
    const cars = this.appState.get('cars');
    const car = cars.find(
      car => car.licensePlate == this.localState.licensePlate);
    if (!car) {
      if (cars.length == 10) {
        window.alert('Resource exceeded!');
        return;
      }
      window.alert(`Submitted! Price=\$${this.calcPrice()}`);
      this.appState.set('cars', [...cars, value])
    } else {
      this.localState = car
      car.visits++;
      window.alert(`Submitted! Price=\$${this.calcPrice()}`);
      this.appState.set('cars', cars)
    }
    this.localState = Object.assign({}, HomeComponent.DEFAULT_STATE)
  }
}
