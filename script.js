import { Api } from "./api.js";

//only holds the state and data
class Model {
  constructor() {
    this.todos = [];
  }
}

//handles the DOM and helps dispatches the controller functions
class View {
  constructor() {
    this.form = document.querySelector(".todo__form");
    this.todoInput = document.querySelector("#newtodo");
    this.pendingList = document.querySelector(".pending__list");
    this.completedList = document.querySelector(".completed__list");
  }

  renderTodos(todos) {
    if (todos.length === 0) {
      this.pendingList.innerHTML = "";
      this.completedList.innerHTML = "";
      const text = document.createElement("p");
      text.textContent = "There are no tasks at this moment.";
      this.pendingList.append(text);
    } else {
      this.pendingList.innerHTML = "";

      todos.forEach((todo) => {
        this.pendingList.innerHTML += `
        <li class="todo" id=${todo.id}>
        
        <p class="">${todo.id}. ${todo.title}</p>

        <button class="checkbtn">check</button>
        <button class="deletebtn">delete</button>
        <button class="editbtn">edit</button>
        </li>`;
      });
    }
  }

  addTodos = (addcontroller) => {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      addcontroller(this.todoInput.value);
      this.todoInput.value = "";
    });
  };

  deleteTodo = (deletecontroller) => {
    this.pendingList.addEventListener("click", (e) => {
      if (e.target.className === "deletebtn") {
        deletecontroller(e.target.parentElement.id);
      }
    });
  };

  editTodo = (editcontroller) => {
    this.pendingList.addEventListener("click", (e) => {
      if (e.target.className === "editbtn") {
        deletecontroller(e.target.parentElement.id);
      }
    });
  };

  checkTodo = (checkcontroller) => {
    this.pendingList.addEventListener("click", (e) => {
      if (e.target.className === "togglebtn") {
        checkcontroller(e.target.parentElement.id);
      }
    });
  };
}

//will be invoked and probably passed down value by the view to perform functionality on the model
//links view(client) to mode(server)
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.addTodos(this.addItem);
    this.view.deleteTodo(this.deleteItem);
    this.view.checkTodo(this.checkItem);

    this.init(this.model.todos);
  }

  init = async () => {
    await Api.getTodos().then((data) => {
      console.log(data);
      this.model.todos = [...data.reverse()];
    });
    this.view.renderTodos(this.model.todos);
  };

  addItem = (val) => {
    const todo = {
      id: this.model.todos.length > 0 ? this.model.todos[0].id + 1 : 0,
      title: val,
      completed: false,
    };
    this.model.todos.unshift(todo);
    this.view.renderTodos(this.model.todos);
  };

  // editItem = (id, data) => {
  //   this.model.todos.map((todo) => {
  //     todo.id === id ? data : todo;
  //   });
  //   this.init(this.model.todos);
  // };

  deleteItem = (id) => {
    this.model.todos = this.model.todos.filter((todo) => {
      return Number(todo.id) !== Number(id);
    });

    this.view.renderTodos(this.model.todos);
  };

  checkItem = (id) => {
    this.model.todos = this.model.todos.map((todo) => {
      return todo.id == id
        ? { id: todo.id, title: todo.title, completed: !todo.completed }
        : todo;
    });

    this.view.renderTodos(this.model.todos);
  };
}

const app = new Controller(new Model(), new View());
