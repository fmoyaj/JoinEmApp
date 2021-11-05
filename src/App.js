import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Navbar } from 'react-bootstrap';
import { Container, Alert, Accordion, InputGroup, FormControl} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import editing from './icons/editing.png';
import coinem from './icons/coinem_icon.png'
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import MaterialButton from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

/* Admin components */
function EditGlobals(props) {
  const [show, setShow] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  function handleClose() {
    setShow(false);
    setCurrentValue("");
  }
  function handleSubmit() {
    if(currentValue > props.maxValue){
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
          <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">{props.title}</InputGroup.Text>
              <FormControl
                aria-label="username"
                aria-describedby="basic-addon1"
                value ={currentValue}
                onChange={updateValue}
              />
            </InputGroup>
          {(currentValue < props.maxValue && currentValue !== "") &&
              <Alert key="alert" variant="danger">
              Invalid value for {props.title.toLowerCase()}. Submit a minimum value of {props.maxValue}.
            </Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {props.handleSaveChanges(currentValue, props.title, props.maxValue); handleSubmit()}}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


function AddMember(props) {
  const [show, setShow] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentLastname, setCurrentLastName] = useState("");

  function handleClose() {
    setShow(false);
    setCurrentUsername("");
    setCurrentName("");
    setCurrentLastName("");
  }
  function handleSubmit() {
    if (!(props.members.map(m => m.username).includes(currentUsername))){
      setShow(false);
      setCurrentUsername("");
      setCurrentName("");
      setCurrentLastName("");
    } 
  }
  const handleOpen = () => setShow(true);

  function updateValue(e){
    const target = e.target;

    switch(target.ariaLabel){
      case "username":
        setCurrentUsername(target.value);
        break;
      case "name":
        setCurrentName(target.value);
        break;
      case "lastname":
        setCurrentLastName(target.value);
        break;
    }
  }

  return (
    <>
      <Button variant="dark" onClick={handleOpen}>
        Add New Member
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
            <FormControl
              placeholder="Unique username"
              aria-label="username"
              aria-describedby="basic-addon1"
              value ={currentUsername}
              onChange={updateValue}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
            <FormControl
              placeholder="First name"
              aria-label="name"
              aria-describedby="basic-addon1"
              value ={currentName}
              onChange={updateValue}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
            <FormControl
              aria-label="lastname"
              aria-describedby="basic-addon1"
              value ={currentLastname}
              onChange={updateValue}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {props.submit(currentUsername, currentName, currentLastname); handleSubmit()}}>
            Submit
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
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  let maxEvents = Math.max(...eventPlanners.map(elem => countOccurrences(eventPlanners, elem)));
  let maxCoinemEvent = Math.max(...coinemEvent);
  let maxCoinemUser = Math.max(...coinemUser);

  return(
  <div>
    <span className="dashboardElem">
      {props.maxEvents}<br/>
      max events
      <EditGlobals title={"Max Events"} handleSaveChanges={props.handleSaveChanges} events={props.events} maxValue={maxEvents}></EditGlobals>
    </span>
    <span className="dashboardElem">
      {props.maxCoinemEvent}<br/>
      max coinem per event
      <EditGlobals title="Max Coinem Per Event" handleSaveChanges={props.handleSaveChanges} events={props.events} maxValue={maxCoinemEvent}></EditGlobals>
    </span>
    <span className="dashboardElem">
      {props.maxCoinem}<br/>
      max coinem per user
      <EditGlobals title="Max Coinem Per User" handleSaveChanges={props.handleSaveChanges} events={props.events} maxValue={maxCoinemUser}></EditGlobals>
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
    <Button variant="dark" className="simpleButton">
      Sort By
    </Button>
    <AddMember submit={props.submit} members={props.data}></AddMember>
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
    <Button variant="dark" className="simpleButton">
      Sort By
    </Button>
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

/* Maybe just use conditional rendering for this!*/
const MemberView = props => (
  <div>
    <h3 className="inLineDivs">
      Members
    </h3>
    <span className="inLineDivs">
      {props.data.length}
    </span>
    <Button variant="dark" className="simpleButton">
      Sort By
    </Button>
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
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)

function AddEvent(props) {
  const [show, setShow] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  let memberEvents = props.events.map(e => e.planner).filter(e => e === props.currentUser);

  function handleClose() {
    setShow(false);
    setCurrentTitle("");
    setCurrentDescription("");
  }
  function handleSubmit() {
    if (currentTitle !== "" && currentDescription !== "" && memberEvents.length < props.MAX_EVENTS
        && !props.events.map( e => e.title).includes(currentTitle)){
      setShow(false);
      setCurrentTitle("");
      setCurrentDescription("");
    } 
  }
  const handleOpen = () => setShow(true);

  function updateValue(e){
    const target = e.target;

    switch(target.ariaLabel){
      case "title":
        setCurrentTitle(target.value);
        break;
      case "description":
        setCurrentDescription(target.value);
        break;
    }
  }

  return (
    <>
      <Button variant="dark" onClick={handleOpen}>
        New Event
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
            <FormControl
              placeholder="Nonempty event title"
              aria-label="title"
              aria-describedby="basic-addon1"
              value ={currentTitle}
              onChange={updateValue}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Description</InputGroup.Text>
            <FormControl as="textarea"
              placeholder="Nonempty event description"
              aria-label="description"
              aria-describedby="basic-addon1"
              value ={currentDescription}
              onChange={updateValue}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {props.handleNewEvent(currentTitle, currentDescription); handleSubmit()}}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function DisplayEvent(props){
  let membersCoinem = props.members.map(member => [member.username, member.coinem]);
  let currentCoinemSpent = 0;
  if (props.members.filter(member => member.username==props.currentUser)[0].coinem[props.event.uid] == undefined) {
    currentCoinemSpent = 0;
  } else {
    currentCoinemSpent = props.members.filter(member => member.username==props.currentUser)[0].coinem[props.event.uid]
  }
  
  return (<div>
    {props.event.planner == props.currentUser && 
    <div class="card">
        <h5 class="card-header" style={{ display: 'flex'}}>
          {props.event.uid.toString() + ". " + props.event.title}
          <Button variant="outline-secondary" size="sm" 
                  style={{ marginLeft: "auto" }}
                  onClick={() => props.deleteEvent(props.event.uid)}>
                    Delete
          </Button>
        </h5>
        <div class="card-body">
          <h5 class="card-title">{props.event.planner}</h5>
          <p class="card-text">{props.event.description}</p>
              <OverlayTrigger trigger="hover" placement="top" overlay={<Popover className="popover" >
                {"Members interested: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).length +  ('\n\n(') + 
                membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => [m[0], m[1][props.event.uid]]).join('\n') + (')' + 
                "\nTotal coinem: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0))
                }
                </Popover>}>
              <Button variant="light"><img src={coinem} className="icons"/>{" " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0)}</Button>
              </OverlayTrigger>
        </div>
      </div>}
      {props.event.planner !== props.currentUser && 
    <div class="card">
        <h5 class="card-header" style={{ display: 'flex'}}>
          {props.event.uid.toString() + ". " + props.event.title}
        </h5>
        <div class="card-body">
          <div class="card-mainDetails">
            <h5 class="card-title">{props.event.planner}</h5>
            <p class="card-text">{props.event.description}</p>
                <OverlayTrigger trigger="hover" placement="top" overlay={<Popover className="popover" >
                  {"Members interested: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).length +  ('\n\n(') + 
                  membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => [m[0], m[1][props.event.uid]]).join('\n') + (')' + 
                  "\nTotal coinem: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0))
                  }
                  </Popover>}>
                <Button variant="light"><img src={coinem} className="icons"/>{" " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0)}</Button>
                </OverlayTrigger>
          </div>
          <div class="card-editFeatures">
            <div class="coinemSpentOnEvent">{currentCoinemSpent} coinem spent</div>
            <ButtonGroup>
              <MaterialButton 
                aria-label="reduce"
                onClick={() => props.toggleCoinemSpent(currentCoinemSpent, "reduce", props.event.uid)}>
                -
              </MaterialButton>
              <MaterialButton
                aria-label="increase"
                onClick={() => props.toggleCoinemSpent(currentCoinemSpent, "increase", props.event.uid)}>
                +
              </MaterialButton>
            </ButtonGroup>
          </div>
        </div>
      </div>}
      </div>); 
}

function MemberEvents (props) {
  return(
  <div>
    <h3 className="inLineDivs">Events</h3>
    <span className="inLineDivs">
      {props.data.length}
    </span>
    <Button variant="dark" className="simpleButton">
      Sort By
    </Button>
    <AddEvent events={props.data} handleNewEvent={props.handleNewEvent} currentUser={props.currentUser} MAX_EVENTS={props.MAX_EVENTS} deleteEvent={props.deleteEvent}></AddEvent>
    {props.data.map(e => (
      <DisplayEvent event = {e} members={props.members} currentUser={props.currentUser} deleteEvent={props.deleteEvent} toggleCoinemSpent={props.toggleCoinemSpent}></DisplayEvent>
    ))}
  </div> )
  }



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
    this.handleNewEvent = this.handleNewEvent.bind(this);
    this.toggleCoinemSpent = this.toggleCoinemSpent.bind(this);
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

  handleNewUser(newUsername, newName, newLastname){
    // Checking that username is unique
    if (!(this.state.members.map(m => m.username).includes(newUsername))){
      this.setState({members: [...this.state.members, {username: newUsername, firstname: newName, lastname: newLastname, coinem: {}}], 
        });
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
    switch(nameGlobal){
      case "Max Events":
        if (newGlobalValue > maxValue){
          this.setState({MAX_EVENTS: newGlobalValue});
        }
        break;
      case "Max Coinem Per Event":
        if (newGlobalValue > maxValue){
          this.setState({MAX_COINEM_PER_EVENT: newGlobalValue});
        }
        break;
      case "Max Coinem Per User":
        if (newGlobalValue > maxValue){
          this.setState({MAX_COINEM: newGlobalValue});
        }
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

  /* Member-specific methods */
  handleNewEvent(newTitle, newDescription){
    let memberEvents = this.state.events.map(e => e.planner).filter(e => e === this.state.currentUser);

    if(newTitle !== "" && newDescription !== "" 
      && memberEvents.length < this.state.MAX_EVENTS && !this.state.events.map( e => e.title).includes(newTitle)){
        this.setState({events: [...this.state.events, {uid: this.state.NEXT_EVENT_UID, title: newTitle, description: newDescription, planner: this.state.currentUser}], 
        NEXT_EVENT_UID: this.state.NEXT_EVENT_UID + 1});
    }
  }

  toggleCoinemSpent(currentCoinemSpent, operation, uid){
    let currentUserInfo = this.state.members.filter(member => member.username==this.state.currentUser)[0]
    let currentCoinem = currentUserInfo.coinem[uid] == undefined? 0:currentUserInfo.coinem[uid];

    if (currentCoinemSpent <= this.state.MAX_COINEM_PER_EVENT) {
      // Addition
      if(operation == "increase" && currentCoinemSpent < this.state.MAX_COINEM_PER_EVENT) {
        let newValue = currentCoinem  + 1;
        let newCoinem = {...currentUserInfo.coinem, [uid]: newValue};
        this.setState({members:[...this.state.members.filter(member => member.username!==this.state.currentUser), {...currentUserInfo, coinem: newCoinem}]});
      }
      // Substraction
      if(operation == "reduce" && currentCoinemSpent>0){
        let newValue = currentCoinem - 1;
        let newCoinem = {...currentUserInfo.coinem, [uid]: newValue};
        this.setState({members:[...this.state.members.filter(member => member.username!==this.state.currentUser), {...currentUserInfo, coinem: newCoinem}]});
      }
    }
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
                    <Dropdown.Toggle variant="secondary">
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
          { this.state.currentUser == "admin" &&
        <div>
          <div>
            <ErrorBoundary>
            <Button onClick={this.downloadHandler}>Download file</Button>
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
        }
        {this.state.currentUser !== "admin" &&
        <div>
          <Stats members={this.state.members}
                  events={this.state.events} 
                  user={this.state.currentUser} 
                  maxEvents={this.state.MAX_EVENTS} 
                  maxCoinem={this.state.MAX_COINEM}>
          </Stats> 
          <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Members</Accordion.Header>
            <Accordion.Body>
              <MemberView data={this.state.members} 
                    events={this.state.events}>
              </MemberView>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <MemberEvents data={this.state.events} 
                  members={this.state.members}
                  deleteEvent={this.deleteEvent}
                  currentUser={this.state.currentUser}
                  handleNewEvent={this.handleNewEvent}
                  toggleCoinemSpent={this.toggleCoinemSpent}
                  MAX_EVENTS={this.state.MAX_EVENTS}>
        </MemberEvents>
        </div>
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
