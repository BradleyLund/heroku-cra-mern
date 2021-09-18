import "../App.css";
import Todo from "./Todo.js";
import Form from "./Form.js";
import React from "react";
import axios from "axios";

class PrivateApp extends React.Component {
  constructor(props) {
    super(props);

    // initialise the state:
    this.state = {
      tasks: [],
      input: "",
    };

    // bind the functions to this
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    // send a get request to the backend with the token
    let access_token = window.localStorage.getItem("AuthToken");

    axios
      .get("/getlist", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        let tasksArray = [];

        for (let i = 0; i < res.data.length; i++) {
          let taskObject = {};

          taskObject._id = res.data[i]._id;
          taskObject.todoDescription = res.data[i].todoDescription;

          tasksArray.push(taskObject);
        }

        this.setState({ tasks: tasksArray });

        console.log(this.state.tasks);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // the function for handling the submition of the form
  handleSubmit(event) {
    // the event gets passed in from when the button with type submit gets clicked
    // preventDefault prevents the automatic refreshing of the page and normal behaviour for a submit button
    event.preventDefault();

    if (this.state.input === "") {
      // make sure the user enters data into the input
      alert("please enter something to do");
    } else {
      let access_token = window.localStorage.getItem("AuthToken");

      axios
        .post(
          "/addtodo",
          { todoDescription: this.state.input },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then((res) => {
          let tasksArray = [];
          for (let i = 0; i < res.data.length; i++) {
            let taskObject = {};
            taskObject._id = res.data[i]._id;
            taskObject.todoDescription = res.data[i].todoDescription;
            tasksArray.push(taskObject);
          }
          this.setState({ tasks: tasksArray });
          console.log(this.state.tasks);
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });

      // clear the state.

      this.setState({ input: "" });
    }
  }

  // the function for handling the state of the input box
  handleChange(event) {
    // the onchange method from the input box passes this function the event (the change)

    // inputval gets the value from where the event came from (the input box)
    let inputVal = event.target.value;
    // console.log(inputVal);

    // set the new state of the input to the new value with extra letters which gets passed back down in the render method
    this.setState({ input: inputVal });
  }

  // handling the deletion of a task
  handleDelete(id) {
    // I just took the name of the task, I know this could cause issues if someone wants to do two tasks with the same name but thought it would do for now
    // I used the filter method to just get the tasks from the state that were not equal to the name of the one we were trying to delete.

    let access_token = window.localStorage.getItem("AuthToken");

    // we need to post to the backend

    axios
      .post(
        "/delete",
        { _id: id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((res) => {
        let tasksArray = [];
        for (let i = 0; i < res.data.length; i++) {
          let taskObject = {};
          taskObject._id = res.data[i]._id;
          taskObject.todoDescription = res.data[i].todoDescription;
          tasksArray.push(taskObject);
        }
        this.setState({ tasks: tasksArray });
        console.log(this.state.tasks);
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <h1>Todo List</h1>
        {/* <Form addTask={addTask} /> */}
        <Form
          input={this.state.input}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />

        <h2>Tasks to do:</h2>
        <ul>
          {/* map through the tasks in the state and use the todo component to give them the necessary html for a list */}
          {this.state.tasks.map((task, index) => (
            <Todo
              name={task.todoDescription}
              id={task._id}
              key={index}
              handleDelete={this.handleDelete}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default PrivateApp;