import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AppComponent, EqualPipe} from './app.component';
import {TwoDigitDecimaNumberDirective} from "./TwoDigitDecimalNumberDirective";
import { ReactiveFormsModule } from '@angular/forms';
import {FilterPipe, Multiselect} from "./mutliselect.component";

@NgModule({
  declarations: [
    AppComponent,
    TwoDigitDecimaNumberDirective,
    Multiselect, FilterPipe, EqualPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
  ],
  providers: [TwoDigitDecimaNumberDirective, EqualPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

