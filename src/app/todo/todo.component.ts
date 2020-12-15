import { Component, OnInit } from '@angular/core';
import { TodoService } from './shared/todo.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [TodoService],
})
export class TodoComponent implements OnInit {
  toDoListArray: any[];
  constructor(private toDoService: TodoService) {}

  disableSelect = new FormControl(false);

  tasksDone: number = 0;
  // isTaskDone: boolean = false;
  // isDeleted: boolean = false;
  selected: boolean = false;
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
    this.toDoService.addTitle(itemTitle.value);
    itemTitle.value = null;
    console.log('selected on added: ' + this.selected);
  }

  alterCheck($key: string, isChecked) {
    this.toDoService.checkOrUnCheckTitle($key, !isChecked);
    isChecked ? this.tasksDone-- : !this.tasksDone++;
    this.selected = true;
    console.log('on click selected: ' + this.selected);
  }

  onDelete($key: string) {
    this.toDoService.removeTitle($key);
    if (this.tasksDone > 0 && this.selected === true) {
      this.tasksDone--;
    }
    // if (this.tasksDone > 0 && !this.selected) {
    //   this.tasksDone++;
    // }
    console.log('after delete: ' + this.selected);
  }

  onReset() {
    this.toDoService.removeAllTitles();
    this.tasksDone = 0;
  }
}
