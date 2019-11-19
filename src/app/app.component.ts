import {ApplicationRef, ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Observable} from "rxjs/Observable";

/*
* @author - Kunal Kumar
* @date - 19/nov/2019
* @description - This Class is responsible to parse UI and parse values based on user selection
*
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./scss/app.component.scss'],
})
export class AppComponent implements OnInit {
  //Filtered Data
  public items: Observable<Array<any>>;
  public selectedItems: Observable<Array<any>>;
  public _selectedItems: Array<any> = [];
  public watchedItems: Array<any>;
  private _items: Array<any>;

  //Values to be Filter
  private lhsOption:any[] =  [{id: "account", lhsFilterName: "Account"},
    {id: "country", lhsFilterName: "Country"},
    {id: "campaign_name", lhsFilterName:"Campaign Name"},
    {id: "revenue", lhsFilterName: "Revenue"}]

  private operators:any[] =  [{id: "contains", parentId: "account", operatorName: "Contains"},
    {id:"not_contains" ,parentId: "account", operatorName: "Not Contains"},
    {id:"contains" ,parentId: "country", operatorName: "Contains"},
    {id:"not_contains" ,parentId: "country", operatorName: "Not Contains"},
    {id:"contains" ,parentId: "campaign_name", operatorName: "Contains"},
    {id:"not_contains" ,parentId: "campaign_name", operatorName: "Not Contains"},
    {id:"starts_with" ,parentId: "campaign_name", operatorName: "Starts With"},
    {id:">" ,parentId: "revenue", operatorName: ">"},
    {id:"<" ,parentId: "revenue", operatorName: "<"},
    {id:">=" ,parentId: "revenue", operatorName: ">="},
    {id:"<=" ,parentId: "revenue", operatorName: "<="},
    {id:"=" ,parentId: "revenue", operatorName: "="},
    {id: "!=", parentid: "revenue", operatorName: "!="}]

  private rhsOption:any[] = [{

  }]

  numberList = [];

  title = 'Clarisights!';
  //Default Country list
  private countryList = [{"name": "Brazil", "code": "BR"},
    {"name": "Canada", "code": "CA"},
    {"name": "France", "code": "FR"},
    {"name": "India", "code": "IN"},
    {"name": "Mexico", "code": "MX"},
    {"name": "Nepal", "code": "NP"},
    {"name": "New Zealand", "code": "NZ"},
    {"name": "Reunion", "code": "RE"},
    {"name": "Singapore", "code": "SG"},
    {"name": "Spain", "code": "ES"},
    {"name": "Sri Lanka", "code": "LK"},
    {"name": "United Kingdom", "code": "GB"},
    {"name": "United States", "code": "US"},
    {"name": "Indonesia", "code": "IN"}];

  //CREATED THE VARIABLES FILTEREDITEMS AND REFELEMENT
  private filterKey = '';
  private filteredItems = [];
  private selected:any[]=[];
  private currentLhs:string = "account";

  private optionList;
  private numberCount:number = 1000;



  constructor(private fb: FormBuilder,private changeRef: ChangeDetectorRef, private appRef: ApplicationRef){
    this._items = [];
    this.items = Observable.of(this._items);
    this.items.subscribe(res => { /*console.log("Items changed");*/ this.watchedItems = res; });

    this.numberList = [];
    for (let i = 1; i < this.numberCount; i++) {
      this.numberList.push({name: i, code:  + i});
    }
  }
  //Dynamic RHS option List based on user LHS selection
  createItems() {
    this._items.length = 0;
    var numItems: number = this.optionList.length;
    //console.log("Adding " + numItems.toString() + " items");
    var i: number;
    for (i =0; i < numItems; i++) {
      this._items.push({ label: this.optionList[i].name, value: this.optionList[i].code});
      //console.log(this._items);
    }
  }
  //Detects change in input
  onChange(newValue) {
    //console.log('received change event');
  }

  //Updated filter values
  public Filter: any[] = [{
    lhs: '',
    operator: '',
    rhs: '',
  }];

  ngOnInit(): void {

  }

// //FILTER DATA METHOD.
//   filterCountry(){
//     if (this.filterKey !== ''){
//       this.filteredItems = this.countryList.filter(function(e){
//         return ((e.name.toLowerCase().substr(0, this.filterKey.length) ==
//           this.filterKey.toLowerCase())) == true;
//       }.bind(this));
//       console.log(this.filteredItems);
//     }
//     else{
//       this.filteredItems = [];
//     }
//   }

//SELCTION ITEM METHOD.
  select(item:any){
    this.filterKey = item;
    this.filteredItems = [];
  }
  filterOperator(id) {
    this.currentLhs = id;
    return this.operators.filter(item => item.parentId === id);
  }
  filterRhsOption(id) {
    switch (id){
      case "account":
        this.optionList = this.numberList;
        break;
      case "country":
        this.optionList = this.countryList;
        break;
    }
    //this.clearFilter();
    this.currentLhs = id;
    if(this.currentLhs == "account" || this.currentLhs == "country")
      this.createItems();
    //console.log("optionlist",this.optionList);
    return this.optionList;
    //return this.operators.filter(item => item.parentId === id);
  }
  //Below functions can be used if we want to improve the auto complete or filter option For now it's just a skeleton
  /*START*/
  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any){
    console.log(items);
  }
  onDeSelectAll(items: any){
    console.log(items);
  }
  /*END*/

  //This function will block user to enter more than 2 decimal place with copy paste
  setTwoNumberDecimal($event) {
    $event.target.value = parseInt($event.target.value).toFixed(2) || 0;
  }
  //ADD MORE FILTER
  addFilter() {
    var filter = this.Filter.push({
      lhs: '',
      operator: '',
      rhs: ''
    });
  }
 //REMOVE FILTER
  removeFilter(i: number) {
    this.Filter.splice(i, 1);
  }
  //LOG FINAL FILTER REQUEST -> We can furthe post the data from below function if we want --> OUTPUT
  logValue() {
    let finalFilters = {filters: this.Filter};
    console.log(finalFilters);
  }
}

//Custom PIPE to filter data from list of data
@Pipe({
  name: 'equal',
  pure: false
})

export class EqualPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      var filteredItems =  items.filter(item =>
        filterKeys.reduce((memo, keyName) => {
          //console.log("Comparing");

          return item[keyName] === filter[keyName];}, true)
      );
      return filteredItems.map(item => item.label);

    } else {
      return items.label;
    }
  }
}
