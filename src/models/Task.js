import { BaseModel } from "./BaseModel";

import { addToStorage } from "../utils";

export class Task extends BaseModel {
    constructor(nameTask,contentTask,descriptionTask=null) {
      super();
      this.nameTask = nameTask;
      this.contentTask = contentTask;
      this.descriptionTask = descriptionTask;
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

  


