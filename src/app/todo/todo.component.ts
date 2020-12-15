import { Component, OnInit } from '@angular/core';
import { TodoService } from './shared/todo.service';
import { FormControl, Validators, FormGroupDirective, NgForm, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoService],
})

export class TodoComponent implements OnInit {
  toDoListArray: any[];
  constructor(private toDoService: TodoService ) {}

  ToDoArray = new FormControl('');
  tasksDone: number = 0;



  ngOnInit() {
    this.toDoService
      .getToDoList()
      .snapshotChanges()
      .subscribe((item) => {
        this.toDoListArray = [];
        item.forEach((element) => {
          var x = element.payload.toJSON();
          x['$key'] = element.key;
          this.toDoListArray.unshift(x);
        });

        // sort array isChecked false  -> true
        // this.toDoListArray.sort((a, b) => {
        //   return a.isChecked - b.isChecked;
        // });
      });
  }

  onAdd(itemTitle) {
    if(!this.ToDoArray.invalid){
    this.toDoService.addTitle(itemTitle.value);
    this.ToDoArray.reset();
    // this.ToDoArray.setValue('');
    }
  }

  alterCheck($key: string, isChecked) {
    this.toDoService.checkOrUnCheckTitle($key, !isChecked);
    isChecked ? this.tasksDone-- : !this.tasksDone++;
  }

  onDelete($key: string, isChecked: boolean) {
    this.toDoService.removeTitle($key);
    if(isChecked){
      this.tasksDone--
    }
  }

  onReset() {
    this.toDoService.removeAllTitles();
    this.tasksDone = 0;
  }
}
