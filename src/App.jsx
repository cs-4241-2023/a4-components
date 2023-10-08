import React from 'react'

class Todo extends React.Component {
    // our .render() method creates a block of HTML using the .jsx format
    render() {
        return <tr>
            <td><p>{this.props.taskname}</p></td>
            <td><p>{this.props.duedate}</p></td>
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

        let taskname = this.taskname.value;
        let duedate = this.duedate.value;

        if (taskname !== undefined && duedate !== undefined) {
            let response = fetch('/add', {
                method: 'POST',
                body: JSON.stringify({taskname: taskname,duedate: duedate}),
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
            let taskname = this.edittaskname.value;
            let duedate = this.editduedate.value;

            if (taskname !== undefined && duedate !== undefined) {
                let response = fetch('/update', {
                    method: 'POST',
                    body: JSON.stringify({_id: this.taskID,taskname: taskname, duedate: duedate}),
                    headers: {'Content-Type': 'application/json'}
                })
                await response;
                this.taskID=-1;
                console.log("Reload")
                window.location.reload();
            }
        }else{
            alert("click edit to edit a task")
        }
    }
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
                                    <input type="text" name="taskname" placeholder="Task" required="required" ref={node => (this.taskname = node)}></input>
                                </div>
                                <div className="addItem">
                                    <label htmlFor="duedate">duedate:</label>
                                    <input type="date" name="duedate" placeholder="duedate" required="required" ref={node => (this.duedate = node)}></input>
                                </div>
                                <div className="addItem">
                                    <button className="add-button" onClick={this.handleSubmit}>submit</button>
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
                                        <label htmlFor="Edit-duedate">duedate:</label>
                                        <input type="date" name="duedate" id="Edit-duedate" required="required" ref={node => (this.editduedate = node)}></input>
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
                            <th><p>duedate</p></th>
                            <th></th>
                            <th></th>
                        </tr>
                        { this.state.todos.map( (todo,i) => <Todo key={i} app={this} id={todo._id} taskname={todo.taskname} duedate={todo.duedate} /> ) }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default App;