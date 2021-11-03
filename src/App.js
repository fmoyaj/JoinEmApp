import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Navbar } from 'react-bootstrap';
import { Container, Alert } from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import editing from './icons/editing.png';
import coinem from './icons/coinem_icon.png'
import { Modal } from 'react-bootstrap';
import { useState } from 'react';

/* Admin components */
function EditGlobals(props) {
  const [show, setShow] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  let maxValue = Math.max(...props.list.map(elem => countOccurrences(props.list, elem)));

  function handleClose() {
    setShow(false);
    setCurrentValue("");
  }
  function handleSubmit() {
    if(currentValue > maxValue){
      setShow(false);
      setCurrentValue("");
    }
  }
  const handleOpen = () => setShow(true);
  const updateValue = (e) => setCurrentValue(e.target.value);

  return (
    <>
      <Button variant="light" onClick={handleOpen}>
            <img src={editing} width="16" height="16"/>
            </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{"Edit " + props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>
          {props.title + ":"}
          <input type="text" 
                  name={props.title}
                  value ={currentValue}
                  onChange={updateValue}>
          </input>
          {(currentValue < maxValue& currentValue !== "") &&
              <Alert key="alert" variant="danger">
              Invalid value for {props.title.toLowerCase()}. Submit a minimum value of {maxValue}.
            </Alert>
          
          }
        </label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {props.handleSaveChanges(currentValue, props.title, maxValue); handleSubmit()}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


function Globals(props){
  let eventPlanners = props.events.map(e => e.planner);
  let coinemEvent = props.members.map(m => Object.values(m.coinem)).flat();
  let coinemUser =  props.members.map(m => Object.values(m.coinem)).map(listElem => listElem.reduce((n,sum) => n+sum, 0)).flat()

  return(
  <div>
    <span className="dashboardElem">
      {props.maxEvents}<br/>
      max events
      <EditGlobals title={"Max Events"} handleSaveChanges={props.handleSaveChanges} events={props.events} list={eventPlanners}></EditGlobals>
    </span>
    <span className="dashboardElem">
      {props.maxCoinemEvent}<br/>
      max coinem per event
      <EditGlobals title="Max Coinem Per Event" handleSaveChanges={props.handleSaveChanges} events={props.events} list={coinemEvent}></EditGlobals>
    </span>
    <span className="dashboardElem">
      {props.maxCoinem}<br/>
      max coinem per user
      <EditGlobals title="Max Coinem Per User" handleSaveChanges={props.handleSaveChanges} events={props.events} list={coinemUser}></EditGlobals>
    </span>
    <span className="dashboardElem">
      {props.nextUID}<br/>
      next event UID
    </span>
  </div>);
}

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
                value ={props.newMember.firstname} 
                onChange={props.handleInputChange}>
        </input>
      </label>
      <label>
        Last Name:
        <input type="text" 
                name="lastName"
                value ={props.newMember.lastname} 
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
          <th>Events</th>
          <th>Coinem spent</th>
          <th>Coinem pairs</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map(member => (
          <tr key={member.username}>
            <td>{member.username}</td>
            <td>{member.firstname}</td>
            <td>{member.lastname}</td>
            <td>{props.events.map(e => e.planner).filter(e => e === member.username).length}</td>
            <td>{props.events.filter(e => e.planner === member.username).map(e => e.uid).join(', ')}</td>
            <td>{Object.values(member.coinem).reduce((n,sum) => n+sum, 0)}</td>
            <td>{Object.entries(member.coinem).map(c => '('+c[0]+','+c[1].toString()+')').join(', ')}</td>
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

function Events (props) {
  let membersCoinem = props.members.map(member => [member.username, member.coinem]);

  return(
  <div>
    <h3 className="inLineDivs">Events</h3>
    <span className="inLineDivs">
      {props.data.length}
    </span>
    <button className="simpleButton">
      Sort By
    </button>
    {props.data.map(event => (
      <div class="card">
        <h5 class="card-header" style={{ display: 'flex'}}>
          {event.uid.toString() + ". " + event.title}
          <Button variant="outline-secondary" size="sm" 
                  style={{ marginLeft: "auto" }}
                  onClick={() => props.deleteEvent(event.uid)}>
                    Delete
          </Button>
        </h5>
        <div class="card-body">
          <h5 class="card-title">{event.planner}</h5>
          <p class="card-text">{event.description}</p>
              <OverlayTrigger trigger="hover" placement="top" overlay={<Popover className="popover" >
                {"Members interested: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).length +  ('\n\n(') + 
                membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => [m[0], m[1][event.uid]]).join('\n') + (')' + 
                "\nTotal coinem: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => m[1][event.uid]).reduce((n,sum) => n+sum, 0))
                }
                </Popover>}>
              <Button variant="light"><img src={coinem} className="icons"/>{" " + membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => m[1][event.uid]).reduce((n,sum) => n+sum, 0)}</Button>
              </OverlayTrigger>
        </div>
      </div>
    ))}
  </div> )
  }

  function AlertDismissible(props) {
    const [show, setShow] = useState(props.showAlert);
  
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>
      );
    }
    return <Button onClick={() => setShow(true)}>Show Alert</Button>;
  }
  


/* Member components */
function Stats(props) {
  let member = props.members.filter(m => m.username === props.user)[0];
  console.log(props.maxCoinem);
  return(
  <div>
    <span className="dashboardElem">
      {props.maxEvents-props.events.filter(e => e.planner === props.user).length}<br/>
      out of {props.maxEvents} events left
    </span>
    <span className="dashboardElem">
      {props.maxCoinem-Object.values(member.coinem).reduce((n,sum) => n+sum, 0)}<br/>
      out of {props.maxCoinem} coinem left
    </span>
  </div>)}


class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      MAX_EVENTS: 3,
      MAX_COINEM_PER_EVENT: 5,
      MAX_COINEM: 20,
      NEXT_EVENT_UID: 1,
      members : [],
      newMember : {username: '', name: '', lastname: '', coinem: 0,},
      events: [],
      fileDownloadUrl: null,
      fileInfo: "",
      currentUser: "admin", // Stores if interface is in admin mode or member mode
      show: false,
      tempGlobalInfo: "",
    } 
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
    this.deleteEvent= this.deleteEvent.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.openFileHandler = this.openFileHandler.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
  }

  handleInputChange(e){
    const target = e.target;

    switch(target.name){
      case "username":
        this.setState({newMember: {...this.state.newMember, username: e.target.value}});
        break;
      case "name":
        this.setState({newMember: {...this.state.newMember, firstname: e.target.value}});
        break;
      case "lastName":
        this.setState({newMember: {...this.state.newMember, lastname: e.target.value}});
        break;
    }
  }

  handleNewUser(){
    let memberToAdd = this.state.newMember;

    // Checking that username is unique
    if (!(this.state.members.map(m => m.username).includes(memberToAdd.username))){
      this.setState({members: [...this.state.members, memberToAdd], 
        newMember : {username: '', firstname: '', lastname: '', coinem: 0, }});
    } else {
      alert("Can't add member. Choose a unique username");
    }
  }

  deleteMember(username){
    this.setState({members: this.state.members.filter(m => m.username !== username),
                  events: this.state.events.filter(e => e.planner !== username)});

  }

  deleteEvent(uid){
    this.setState({events: this.state.events.filter(e => e.uid !== uid),
                    members: this.state.members.map(m => {return {...m, coinem: Object.keys(m.coinem).filter(key =>
                      key !== uid.toString()).reduce((obj, key) =>
                      {
                          obj[key] = m.coinem[key];
                          return obj;
                      }, {}
                  )}})});
    console.log(this.state.members);
  }

  downloadHandler (event) {
    event.preventDefault(); // Prevent default actions of event                   
    // Prepare the file  
    let output = JSON.stringify({MAX_EVENTS: this.state.MAX_EVENTS, 
      MAX_COINEM_PER_EVENT: this.state.MAX_COINEM_PER_EVENT, 
      MAX_COINEM: this.state.MAX_COINEM,
      NEXT_EVENT_UID: this.state.NEXT_EVENT_UID,
      members: this.state.members,
      events: this.state.events,
    }, null, 4);
    console.log(output);
    // Download it            
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    this.setState ({fileDownloadUrl: fileDownloadUrl},
      // setState takes a callback function as an optional 2nd argument.          
      // It is called only after the state has been updated.                       
      () => {
        this.domFileDownload.click();
        URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.       
        this.setState({fileDownloadUrl: ""})
    })
  }

  handleSaveChanges (newGlobalValue, nameGlobal, maxValue){
    // let eventPlanners = this.state.events.map(e => e.planner);
    // let coinemEvent = this.state.members.map(m => Object.values(m.coinem)).flat();
    // let coinemUser =  this.state.members.map(m => Object.values(m.coinem)).map(listElem => listElem.reduce((n,sum) => n+sum, 0)).flat()
    // const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // let min = Math.min(...eventPlannersf.map(elem => countOccurrences(eventPlanners, elem)));
    console.log(maxValue);
    switch(nameGlobal){
      case "Max Events":
        if (newGlobalValue > maxValue){
          this.setState({MAX_EVENTS: newGlobalValue});
        }
        break;
      case "Max Coinem Per Event":
        this.setState({MAX_COINEM_PER_EVENT: newGlobalValue});
        break;
      case "Max Coinem Per User":
        this.setState({MAX_COINEM: newGlobalValue});
        break;
    }
  }

  uploadHandler(event) {
    event.preventDefault();
    this.domFileUpload.click() // This will browse for a file to upload 
                               // and then call the openFileHandler from 
                               // the input component's onChange handler.      
  }

  /**  
   * Process the uploaded file within the React app.
   */
   openFileHandler(event) {
    let fileInfoList = []; // Status output 
    const fileObj = event.target.files[0]; // From automated .click() on file input component
    const reader = new FileReader();

    let fileLoadedHandler = e => {
      // e.target.result is the file's content as text 
      const fileContents = e.target.result;
      fileInfoList.push(`File name: "${fileObj.name}". Length: ${fileContents.length} bytes.`);
      fileInfoList.push (`File contents: ${fileContents}`)
      const jsonData = JSON.parse(fileContents);
      const jsonMembersData = jsonData.members
      const jsonEventsData = jsonData.events
      const jsonMAX_EVENTS = jsonData.MAX_EVENTS;
      const jsonMAX_COINEM_PER_EVENT = jsonData.MAX_COINEM_PER_EVENT;
      const jsonMAX_COINEM = jsonData.MAX_COINEM;
      const jsonNEXT_UID = jsonData.NEXT_EVENT_UID;
      this.setState ({fileInfo: fileInfoList.join("\n")});
      this.setState ({members: jsonMembersData, events: jsonEventsData, MAX_EVENTS: jsonMAX_EVENTS, MAX_COINEM: jsonMAX_COINEM,
        MAX_COINEM_PER_EVENT: jsonMAX_COINEM_PER_EVENT,  NEXT_EVENT_UID: jsonNEXT_UID});
    }

    // Mainline of the method 
    fileLoadedHandler= fileLoadedHandler.bind(this);
    reader.onload = fileLoadedHandler;
    reader.readAsText(fileObj);
}

  becomeMember(name){
    this.setState({currentUser: name});
    console.log(this.state.currentUser);
  }


  render(){
    return (
      <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand>Join'Em</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav>
              <Dropdown>
                <Dropdown.Toggle>
                  Members
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto"}}>
                  <Dropdown.Item onClick={()=> this.becomeMember("admin")}>admin</Dropdown.Item>
                  {this.state.members.map(m =>
                    <Dropdown.Item eventKey={m.username} onClick={()=> this.becomeMember(m.username)}>{m.username}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

        <div>
          <ErrorBoundary>
          <button onClick={this.downloadHandler}>Download file</button>
          </ErrorBoundary>
          <Button onClick={this.uploadHandler}>Upload file</Button>
        </div>
        <Globals maxEvents={this.state.MAX_EVENTS}
                maxCoinem={this.state.MAX_COINEM}
                maxCoinemEvent={this.state.MAX_COINEM_PER_EVENT}
                nextUID ={this.state.NEXT_EVENT_UID}
                handleSaveChanges={this.handleSaveChanges}
                events={this.state.events}
                members={this.state.members}
                >
        </Globals>
        <ErrorBoundary>
        <Members data={this.state.members} 
                  events={this.state.events}
                  newMember={this.state.newMember} 
                  handleInputChange={this.handleInputChange}
                  submit={this.handleNewUser}
                  deleteMember={this.deleteMember}>
        </Members>
        </ErrorBoundary>
        <Events data={this.state.events} 
                members={this.state.members}
                deleteEvent={this.deleteEvent}>

        </Events>
        {this.state.currentUser !== "admin" &&
          <Stats members={this.state.members}
                  events={this.state.events} 
                  user={this.state.currentUser} 
                  maxEvents={this.state.MAX_EVENTS} 
                  maxCoinem={this.state.MAX_COINEM}>
          </Stats>
        }
      
      <input type="file"
            className="hidden"                                                                   
            multiple={false}
            accept=".json, application/json" // Only upload JSON files                              
            onChange={evt => this.openFileHandler(evt)}
            ref={
              // This is so-called "callback ref" that captures the associated
              // DOM element on rendering.
              // See https://reactjs.org/docs/refs-and-the-dom.html 
              domElt => this.domFileUpload = domElt
            }
          />
        
           {/* <input type="file"
            className="hidden"                                                                   
            multiple={false}
            accept=".json, application/json" // Only upload JSON files                              
            onChange={evt => this.openFileHandler(evt)}
            ref={
              // This is so-called "callback ref" that captures the associated
              // DOM element on rendering.
              // See https://reactjs.org/docs/refs-and-the-dom.html 
              domElt => this.domFileUpload = domElt
            }
          /> */}

          <a className="hidden" 
            download="joinemData.json" // download attribute specifies file name                                        // to download to when clicking link 
             href={this.state.fileDownloadUrl}
             ref={
              // This is so-called "callback ref" that captures the associated 
              // DOM element on rendering.
              // See https://reactjs.org/docs/refs-and-the-dom.html
              domElt => this.domFileDownload = domElt
            }
          >download it</a>
        <pre className="status" className="hidden">{this.state.fileInfo}</pre>
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
