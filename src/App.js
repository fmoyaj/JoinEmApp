import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Globals = props => (
  <div>
    <span className="dashboardElem">
      {props.maxEvents}<br/>
      max events
      <img src={"/icons/editing.png"}/>
    </span>
    <span className="dashboardElem">
      {props.maxCoinemEvent}<br/>
      max coinem per event
    </span>
    <span className="dashboardElem">
      {props.maxCoinem}<br/>
      max coinem per user
    </span>
    <span className="dashboardElem">
      {props.nextUID}<br/>
      next event UID
    </span>
  </div>
)

const Members = props => (
  <div>
    <h3 className="inLineDivs">
      Members
    </h3>
    <span className="inLineDivs">
      {props.data.length}
    </span>
    <button className="simpleButton">
      Sort By
    </button>
    <button className="simpleButton" onClick={props.handleNewUser}>
      Add Member
    </button>
    <form>
      <label>
        Username:
        <input type="text" 
              name="username" 
              value ={props.newMember.username} 
              onChange={props.handleInputChange}>
        </input>
      </label>
      <label>
        Name:
        <input type="text" 
                name="name"
                value ={props.newMember.name} 
                onChange={props.handleInputChange}>
        </input>
      </label>
      <label>
        Last Name:
        <input type="text" 
                name="lastName"
                value ={props.newMember.lastName} 
                onChange={props.handleInputChange}>
        </input>
      </label>
    </form>
    <button onClick={props.submit}>Add Member</button>
    <Table striped border hover>
      <thead>
        <tr>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th># of Events Planned</th>
          <th>Coinem spent</th>
          <th>Coinem pairs</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map(member => (
          <tr key={member.username}>
            <td>{member.username}</td>
            <td>{member.name}</td>
            <td>{member.lastName}</td>
            <td>Placeholder</td>
            <td>{member.coinem}</td>
            <td>Placeholder</td>
            <td><Button variant="outline-secondary" size="sm" onClick={() => props.deleteMember(member.username)}>
                  Delete
                </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>

)

const Events = props => (
  <div>
    <h3>Events</h3>
    <span className="inLineDivs">
      {props.data.length}
    </span>
    <button className="simpleButton">
      Sort By
    </button>
    
  </div> 
)


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      MAX_EVENTS: 3,
      MAX_COINEM_PER_EVENT: 5,
      MAX_COINEM: 20,
      NEXT_EVENT_UID: 1,
      members : [],
      newMember : {username: '', name: '', lastName: '', coinem: 0,}
    } 
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
  }

  handleInputChange(e){
    const target = e.target;

    switch(target.name){
      case "username":
        this.setState({newMember: {...this.state.newMember, username: e.target.value}});
        break;
      case "name":
        this.setState({newMember: {...this.state.newMember, name: e.target.value}});
        break;
      case "lastName":
        this.setState({newMember: {...this.state.newMember, lastName: e.target.value}});
        break;
    }
  }

  handleNewUser(){
    let memberToAdd = this.state.newMember;

    // Checking that username is unique
    if (!(this.state.members.map(m => m.username).includes(memberToAdd.username))){
      this.setState({members: [...this.state.members, memberToAdd], 
        newMember : {username: '', name: '', lastName: '', coinem: 0, }});
    } else {
      alert("Can't add member. Choose a unique username");
    }
  }

  deleteMember(username){
    //console.log(username)
    this.setState({members: this.state.members.filter(m => m.username !== username)});
  }

  render(){
    return (
      <div>
        <header>Join'Em 
          <button>Admin</button>
          <button>Member</button>
        </header>
        <Globals maxEvents={this.state.MAX_EVENTS}
                maxCoinem={this.state.MAX_COINEM}
                maxCoinemEvent={this.state.MAX_COINEM_PER_EVENT}
                nextUID ={this.state.NEXT_EVENT_UID}
                >
        </Globals>
        <Members data={this.state.members} 
                  newMember={this.state.newMember} 
                  handleInputChange={this.handleInputChange}
                  submit={this.handleNewUser}
                  deleteMember={this.deleteMember}>
        </Members>
        {//<Events data={this.state.members.map(m => m.events)}></Events>
  }
      </div>
    );
  }

}

/**
 * ErrorBoundaries can improve error reporting. This class is copied from:
 * https://reactjs.org/docs/error-boundaries.html
 */
 class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {    
    // Update state so the next render will show the fallback UI.    
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {    
    // You can also log the error to an error reporting service    
    console.log(`error: ${error}; errorInfo: ${errorInfo}`);  
  }
 
  render() {
    if (this.state.hasError) {      
      // You can render any custom fallback UI      
      return <h1>Something went wrong.</h1>;    
    }
    return this.props.children; 
  }
}



export default App;
