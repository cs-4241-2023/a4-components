import React from 'react'

class UserRow extends React.Component {
    render(){
        return <tr>
            <td><p>{this.props.name}</p></td>
            <td><p>{this.props.email}</p></td>
            <td><p>{this.props.type}</p></td>
            <td><button onClick={() => {this.deleteUser(this.props.user)}}>Delete</button></td>
        </tr>
    }

    deleteUser = async function (user){  
        console.log(user)
        const body = JSON.stringify( user )
        const response = await fetch( "/deleteUser", {
          method:"DELETE",
          body:body
        })
        const text = await response.text()
        window.location.reload();
    }
}

export default UserRow;