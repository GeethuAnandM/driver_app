import { action, computed, makeObservable, observable } from "mobx";
import { act } from "react-test-renderer";
import { filterArrayByDate, uniqueArray } from "../../Utils/helper";
import { setItem } from "../../Services/apiCalls";
class ExpenseStore {
  activeTab = { name: "Trip Expens", index: 0 };
  expenseTypes = [];
  driverExpense = [];
  driverSelectedExpense = [];
  filterTripsExp = [];
  filterVehicleExp = [];
  filterGeneralExp = [];
  mendatoryExpense = [];
  newMendatoryExpense=[];
// ExpenseIsAdded = [{ key: 'added', value: false }];
  ExpenseIsAdded = [];

  
 // expense = { image: "", value: 0 };
 
  constructor() {
    makeObservable(this, {
      newMendatoryExpense: observable,
      ExpenseIsAdded: observable,
      activeTab: observable,
      expenseTypes: observable,
      driverExpense: observable,
      driverSelectedExpense: observable,
      filterTripsExp: observable,
      filterVehicleExp: observable,
      filterGeneralExp: observable,
      mendatoryExpense: observable,
      setDriverSelectedExpense: action,
      resetAllExpense: action,
      setDriverExpense: action,
      setExpenseTypes: action,
      setMendatoryExpense: action,
      setActiveTab: action,
      changeExpense: action,
      setExpenseIsAdded: action,
      setNewMendatoryExpense:action,
      
     

    });
  }
  setActiveTab(value) {
    this.activeTab = value;
  }
  setMendatoryExpense(value) {
    this.mendatoryExpense = value;
  }
  setExpenseIsAdded(value) {
    this.ExpenseIsAdded = value;
  }
  setNewMendatoryExpense(value) {
    this.newMendatoryExpense = value;
  }

  changeExpense(value) {
    var oldEx = this.mendatoryExpense;
    //console.log("index of mendatoryexpense array" ,oldEx.length-1)
   // console.log("from expense store",oldEx)
    //console.log("value from expense store",value)
    //var array = []; 
    var expense = oldEx.map((item) => {
      //text={item[0]?.subType + " - " + item[0]?.typeName}
     
      //console.log("item.typeid from expense store",item[0]?.typeId)
      var typeId=item[0]?.typeId;
      
    
      if (item[0]?.typeId === value) {
       // console.log("if from expense store success");
       
       this. ExpenseIsAdded.push({ key: 'added', value: true, expenseTypeId: typeId });
       setItem("expenseIsAdded", this. ExpenseIsAdded)
       return { ...item, isAdded: true };
      }

      else {
        console.log("else from expense store s in action")
        return item;
      }
     
    });
    console.log("array from expnse",this. ExpenseIsAdded);
    //this. setMendatoryExpense(expense);
    this.mendatoryExpense=expense
    setItem("mendatoryExpense", this. mendatoryExpense);
    this.newMendatoryExpense = expense;
    setItem("newMendatoryExpense", this. newMendatoryExpense);
    //console.log("from expnse store",  this.newMendatoryExpense)
    
    
  }
  setDriverExpense(value) {
    var trip = value.filter((e) => e.tripId !== null);
    var vehicle = value.filter((e) => e.vehicleId !== null);
    var general = value.filter(
      (e) => e.vehicleId === null && e.tripId === null
    );
    const typeid = uniqueArray(general, "expenseTypeId");
    const tripId = uniqueArray(trip, "tripId");
    const vehicleId = uniqueArray(vehicle, "vehicleId");
    this.filterGeneralExp = filterArrayByDate(
      general?.reverse(),
      "desc",
      "expenseDate"
    );
    this.driverExpense = value;
    this.filterTripsExp = tripId?.reverse();
    this.filterVehicleExp = filterArrayByDate(
      vehicleId?.reverse(),
      "desc",
      "expenseDate"
    );
  }
  setExpenseTypes(value) {
    var data = value?.filter((item) => item?.isActive === "Active");

    this.expenseTypes = data;
  }
  setDriverSelectedExpense(value) {
    this.driverSelectedExpense = value;
  }
  resetAllExpense() {
    this.expenseTypes = null;
    this.driverExpense = [];
    this.driverSelectedExpense = [];
    this.filterTripsExp = [];
    this.filterVehicleExp = [];
   
    this.ExpenseIsAdded = [];
  }
  
}
export const expenseStore = new ExpenseStore();
