import React from 'react'

class Todo extends React.Component {
    // our .render() method creates a block of HTML using the .jsx format
    render() {
        return <tr>
            <td><p>{this.props.task}</p></td>
            <td><p>{this.props.creation}</p></td>
            <td><p>{this.props.deadline}</p></td>
            <td><p>{this.JudgePriority(this.props.deadline)}</p></td>
            <td><button>Edit</button></td>
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

    // render component HTML using JSX
    render() {
        return (
            <div>
                <div className="header">
                    <h3>Todo List</h3>
                </div>
                <div className="addTask">
                    <h4>Add Tasks</h4>
                    <form id="addItemContainer">
                        <div className="addItem">
                            <input type="text" name="Task" placeholder="Task" required="required" ref={node => (this.task = node)}></input>
                        </div>
                        <div className="addItem">
                            <input type="date" name="CreationDate" placeholder="CreationDate" required="required" ref={node => (this.creationDate = node)}></input>
                        </div>
                        <div className="addItem">
                            <input type="date" name="Deadline" placeholder="Deadline" required="required" ref={node => (this.deadline = node)}></input>
                        </div>
                        <div className="addItem">
                            <button className="add-button" onClick={this.handleSubmit}>submit</button>
                        </div>
                        <div className="addItem">
                            <button className="resetForm-button" onClick={this.ClearForm}>reset</button>
                        </div>
                    </form>
                </div>
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
                        { this.state.todos.map( (todo,i) => <Todo key={i} id={todo._id} task={todo.task} creation={todo.creationDate} deadline={todo.deadline} /> ) }
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