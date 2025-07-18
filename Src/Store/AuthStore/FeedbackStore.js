import { action, makeObservable, observable } from "mobx";
class FeedbackStore {
 
  EndFeedback={verified: false,rating:"",feedback:"",review:""};
    //permitList = [];
    //EndFeedback={verified: false};
   
    constructor() {
      makeObservable(this, {
        EndFeedback:observable,
       
       setEndFeedback:action,
      setEndRating:action,
      setEndFeedbackSelected:action,
      setEndFeedbackReview:action,
      resetEndFeedback:action,
       
      });
    }
   
   
    setEndFeedback(value) {
      this.EndFeedback.verified = value;
    }
    setEndRating(value){
      this.EndFeedback.rating=value
    }
    setEndFeedbackSelected(value){
      this.EndFeedback.feedback=value
  
    }
  setEndFeedbackReview(value){
   this.EndFeedback.review=value 
  }
    resetEndFeedback() {
    
      this.EndFeedback={verified: false,rating:"",feedback:"",review:""};
      
    }
  
    
  }
  export const feedbackStore = new FeedbackStore();
  