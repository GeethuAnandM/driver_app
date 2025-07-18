import { action, computed, makeObservable, observable } from "mobx";
class LoaderStore {
  isLoading = false;
  constructor() {
    makeObservable(this, {
      isLoading: observable,
      setIsLoading: action,
    });
  }
  setIsLoading(value) {
    this.isLoading = value;
  }
}
export const loaderStore = new LoaderStore();
