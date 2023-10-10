import React from 'react'

class Todo extends React.Component {
    // our .render() method creates a block of HTML using the .jsx format
    render() {
        return( 
        <tr>
            <td><p>{this.props.task}</p></td>
            <td><p>{this.props.duedate}</p></td>
            <td><button onClick={(e) =>{this.deleteData(e,this.props.id)}}>Delete</button></td>
        </tr>);
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

        let task = this.task.value;
        let duedate = this.duedate.value;

        if (task !== undefined && duedate !== undefined) {
            let response = fetch('/add', {
                method: 'POST',
                body: JSON.stringify({task: task,duedate: duedate}),
                headers: {'Content-Type': 'application/json'}
            })
            await response;
            console.log("Reload")
            window.location.reload();
        }
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>What do I have to do?</h1>
                    <p>a quick organzier created by Sean</p>
                </div>
                <table>
                    <tr>
                        <td><div className="addTask">
                            <h4>Add Tasks</h4>
                            <form id="addItemContainer">
                                <div className="addItem">
                                    <label>Task:</label>
                                    <input type="text" name="task" placeholder="Task" required="required" ref={node => (this.task = node)}></input>
                                </div>
                                <div className="addItem">
                                    <label>Due Date:</label>
                                    <input type="date" name="duedate" required="required" ref={node => (this.duedate = node)}></input>
                                </div>
                                <div className="addItem">
                                    <button className="add-button" onClick={this.handleSubmit}>submit</button>
                                </div>
                            </form>
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
                        </tr>
                        { this.state.todos.map( (todo,i) => <Todo key={i} app={this} id={todo._id} task={todo.task} duedate={todo.duedate} /> ) }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default App;