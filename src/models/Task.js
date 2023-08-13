import { BaseModel } from "./BaseModel";
//import { appState } from "../app";
import { addToStorage } from "../utils";

export class Task extends BaseModel {
    constructor(nameTask,contentTask) {
      super();
      this.nameTask = nameTask;
      this.contentTask = contentTask;
    
    }
    
    static save(task,loginTask) {
        try {
            addToStorage(task,loginTask);
          return true;
        } catch (e) {
          throw new Error(e);
        }
      }
 
 
}

  


