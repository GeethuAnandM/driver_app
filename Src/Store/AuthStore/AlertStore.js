// AlertStore.js
import { makeAutoObservable } from "mobx";

class AlertStore {
  visible = false;
  title ;
  message ;
  confirmText ;
  onConfirm ;

  constructor() {
    makeAutoObservable(this);
  }

  show({ title, message, confirmText = "OK", onConfirm = null }) {
    this.visible = true;
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.onConfirm = onConfirm;
  }

  hide() {
    this.visible = false;
    this.title = "";
    this.message = "";
    this.confirmText = "OK";
    this.onConfirm = null;
  }
}

export const alertStore = new AlertStore();
