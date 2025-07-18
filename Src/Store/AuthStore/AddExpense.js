import { action, makeObservable, observable } from "mobx";

class AddExpense {
  selectedTrip = {};
  selectedExpense = {};
  selectedImage = "";
  expTitle = "";
  expAmount = "";
  constructor() {
    makeObservable(this, {
      selectedTrip: observable,
      selectedExpense: observable,
      selectedImage: observable,
      expTitle: observable,
      expAmount: observable,
      setSelectedTrip: action,
      setSelectedExpense: action,
      setExpTitle: action,
      setSelectedImage: action,
      setExpAmount: action,
      resetAllExpense: action,
    });
  }
  setSelectedTrip(value) {
    this.selectedTrip = value;
  }
  setSelectedExpense(value) {
    this.selectedExpense = value;
  }
  setExpTitle(value) {
    this.expTitle = value;
  }
  setSelectedImage(value) {
    this.selectedImage = value;
  }
  setExpAmount(value) {
    this.expAmount = value;
  }
  resetAllExpense() {
    this.selectedTrip = {};
    this.selectedExpense = {};
    this.selectedImage = "";
    this.expTitle = "";
    this.expAmount = "";
  }
}
export const addExpense = new AddExpense();
