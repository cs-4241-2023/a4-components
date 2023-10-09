import React from 'react'

class Todo extends React.Component {
    // our .render() method creates a block of HTML using the .jsx format
    render() {
        return <tr>
            <td><p>{this.props.task}</p></td>
            <td><p>{this.props.creation}</p></td>
            <td><p>{this.props.deadline}</p></td>
            <td><p>{this.JudgePriority(this.props.deadline)}</p></td>
            <td><button onClick={(e) =>{this.props.app.openEditForm(this.props.id)}}>Edit</button></td>
            <td><button onClick={(e) =>{this.deleteData(e,this.props.id)}}>Delete</button></td>
        </tr>
    }

    deleteData(e,taskID){
        e.preventDefault()
        const body = JSON.stringify({_id:taskID});

        fetch("/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        }).then(r =>{
            console.log("Deleted")
            window.location.reload();
        })
    }

    JudgePriority(deadline){
        let today=new Date();
        let dateDiff=this.DateDifference(today,new Date(deadline));
        let priority="High Priority"
        if(dateDiff>2){
            priority="Low Priority";
        }else if(dateDiff>1){
            priority="Medium Priority";
        }else if(isNaN(dateDiff)){
            priority="NaN";
        }
        return priority;
    }

    DateDifference(day1,day2){
        let date1=Date.UTC(day1.getFullYear(), day1.getMonth(), day1.getDate());
        let date2= Date.UTC(day2.getFullYear(), day2.getMonth(), day2.getDate());

        return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    }
}

class App extends React.Component {
    constructor( props ) {
        super( props )
        // initialize our state
        this.state = { todos:[] }
        this.load()
        this.taskID=-1;
    }


    // load in our data from the server
    load() {
        fetch( '/read', { method:'get', 'no-cors':true })
            .then( response => response.json() )
            .then( json => {
                this.setState({ todos:json })
            })
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let task = this.task.value;
        let creation = this.creationDate.value;
        let deadline = this.deadline.value;

        if (task !== undefined && creation !== undefined && deadline !== undefined) {
            let response = fetch('/add', {
                method: 'POST',
                body: JSON.stringify({task: task, creationDate: creation, deadline: deadline}),
                headers: {'Content-Type': 'application/json'}
            })
            await response;
            console.log("Reload")
            window.location.reload();
        }
    }

    handleEdit = async (event) => {
        event.preventDefault();

        if(this.taskID!==-1){
            let task = this.editTask.value;
            let creation = this.editCreation.value;
            let deadline = this.editDeadline.value;

            if (task !== undefined && creation !== undefined && deadline !== undefined) {
                let response = fetch('/update', {
                    method: 'POST',
                    body: JSON.stringify({_id: this.taskID,task: task, creationDate: creation, deadline: deadline}),
                    headers: {'Content-Type': 'application/json'}
                })
                await response;
                this.taskID=-1;
                console.log("Reload")
                window.location.reload();
            }
        }else{
            alert("You need to click a task's edit button before you can edit a task")
        }
    }

    // render component HTML using JSX
    closeEditForm() {
        this.editForm.style.display="none";
        this.taskID=-1;
    }
    openEditForm(id){
        this.editForm.style.display="block";
        this.taskID=id;
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Todo List</h1>
                </div>
                <table>
                    <tr>
                        <td><div className="addTask">
                            <h4>Add Tasks</h4>
                            <form id="addItemContainer">
                                <div className="addItem">
                                    <label htmlFor="Task">Task:</label>
                                    <input type="text" name="Task" placeholder="Task" required="required" ref={node => (this.task = node)}></input>
                                </div>
                                <div className="addItem">
                                    <label htmlFor="CreationDate">Creation Date:</label>
                                    <input type="date" name="CreationDate" placeholder="CreationDate" required="required" ref={node => (this.creationDate = node)}></input>
                                </div>
                                <div className="addItem">
                                    <label htmlFor="Deadline">Deadline:</label>
                                    <input type="date" name="Deadline" placeholder="Deadline" required="required" ref={node => (this.deadline = node)}></input>
                                </div>
                                <div className="addItem">
                                    <button className="add-button" onClick={this.handleSubmit}>submit</button>
                                </div>
                                <div className="addItem">
                                    <button className="resetForm-button" onClick={this.ClearForm}>reset</button>
                                </div>
                            </form>
                        </div></td>
                        <td><div className="Edit-Task" ref={node => (this.editForm = node)}>
                            <h4>Edit Task</h4>
                            <div>
                                <form id="taskContainer">
                                    <div className="addItem">
                                        <label htmlFor="Edit-Task">Task:</label>
                                        <input type="text" name="Task" id="Edit-Task" placeholder="Task" ref={node => (this.editTask = node)} required="required"></input>
                                    </div>
                                    <div className="addItem">
                                        <label htmlFor="Edit-CreationDate">Creation Date:</label>
                                        <input type="date" name="CreationDate" id="Edit-CreationDate" label="Creation Date"
                                               required="required" ref={node => (this.editCreation = node)}></input>
                                    </div>
                                    <div className="addItem">
                                        <label htmlFor="Edit-Deadline">Deadline:</label>
                                        <input type="date" name="Deadline" id="Edit-Deadline" required="required" ref={node => (this.editDeadline = node)}></input>
                                    </div>
                                    <div className="addItem">
                                        <button className="edit-button" onClick={this.handleEdit}>Update</button>
                                    </div>
                                </form>
                                <button onClick={(e) =>{this.closeEditForm()}} className="close-edit-button">Close Edit Window</button>
                            </div>
                        </div></td>
                    </tr>
                </table>
                <div id="task-table">
                    <h1>Tasks</h1>
                    <table>
                        <tbody>
                        <tr>
                            <th><p>Task</p></th>
                            <th><p>Creation Date</p></th>
                            <th><p>Deadline</p></th>
                            <th><p>Priority</p></th>
                            <th></th>
                            <th></th>
                        </tr>
                        { this.state.todos.map( (todo,i) => <Todo key={i} app={this} id={todo._id} task={todo.task} creation={todo.creationDate} deadline={todo.deadline} /> ) }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    ClearForm=()=>{
        document.getElementById( '#addItemContainer' ).reset();
    }
}

export default App;