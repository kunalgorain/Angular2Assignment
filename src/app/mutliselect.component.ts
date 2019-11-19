import {ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, Pipe, PipeTransform, Renderer} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EqualPipe} from './app.component';
import {Subscription} from "rxjs/Subscription";
/*
* @author - Kunal Kumar
* @date - 19/nov/2019
* @description - This Class is responsible to handle Multiselect data with search
*
*/
@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      return items.filter(item =>
        filterKeys.reduce((memo, keyName) =>
          (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
    } else {
      return items;
    }
  }
}

const MULTISELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Multiselect),
  multi: true
};

@Component({
  selector: 'multiselect',
  templateUrl: './multiselect.html',
  styleUrls: ['./scss/multiselect.scss'],
  host: {'(change)': 'manualChange($event)', '(document:click)': 'hostClick($event)'},
  providers: [MULTISELECT_VALUE_ACCESSOR]
})

export class Multiselect implements OnInit, ControlValueAccessor {
  public _items: Array<any>;
  public _selectedItems: Array<any>;
  public localHeader: string;
  public isOpen: boolean = false;
  public enableFilter: boolean;
  public filterText: string;
  public filterPlaceholder: string;
  public filterInput = new FormControl();
  private _subscription: Subscription;
  @Input() items: Observable<any[]>;
  @Input() header: string = "value";
  @Input() selectedHeader: string = "options selected";

  // ControlValueAccessor Interface and mutator
  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  constructor(private _elRef: ElementRef, private _renderer: Renderer, private _equalPipe: EqualPipe, private _changeDetectorRef: ChangeDetectorRef) {
  }

  //Getter method to get selected data
  get selected(): any {
    return this._selectedItems;
  };
  //Print values
  writeValue(value: any) {
    if (value !== undefined) {
      this._selectedItems = value;
    } else  {
      this._selectedItems = [];
    }
  }
  //Set user selected values in div from list
  setHeaderText() {
    this.localHeader = this.header;
    //console.log(this._selectedItems);
    var isArray = this._selectedItems instanceof Array;
    if (isArray && this._selectedItems.length > 1) {
      //
      this.localHeader = this._selectedItems.length + ' ' + this.selectedHeader;
    } else if (isArray && this._selectedItems.length === 1) {
      this.localHeader = this._selectedItems[0];
    }
    //console.log("Set header text " + this.localHeader);
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; /*console.log(fn);*/ }
  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setElementProperty(this._elRef.nativeElement, 'disabled', isDisabled);
  }

  manualChange() {
    this._onChange(this._selectedItems);
  }

  selectItem(item: any) {
    item.checked = !item.checked;
    this._selectedItems = this._equalPipe.transform(this._items, {checked: true});
    this.setHeaderText();
    this._onChange(this._selectedItems);
  }

  toggleSelect() {
    this.isOpen = !this.isOpen;
  }

  clearFilter() {
    this.filterText = "";
  }

  hostClick(event) {
    //console.log("clicked",event.target.value);
    this._onChange(this._selectedItems);

    if (this.isOpen && !this._elRef.nativeElement.contains(event.target))
      this.isOpen = false;
  }

  ngOnInit() {
    this._subscription = this.items.subscribe(res => this._items = res);
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Filter..";
    this._selectedItems = this._equalPipe.transform(this._items, {checked: true});
    this.setHeaderText();
    this.filterInput
      .valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(term => {
        this.filterText = term;
        this._changeDetectorRef.markForCheck();
        //console.log(term);
      });
  }
}
