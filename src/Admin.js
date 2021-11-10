// Admin.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Container, Alert, InputGroup, FormControl, Row, Col} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import editing from './icons/editing.png';
import coinem from './icons/coinem_icon.png'
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {RadioGroup, Radio, FormLabel, FormControlLabel} from '@material-ui/core';
import MUFormControl from '@material-ui/core/FormControl';


// 'export' in front of the functions will allow the functions to be imported in other files, like App.js


// Displays the Global variables for the admin. Global Variables include:
// MAX_EVENTS (with default value 3): the maximum number of events that a member can currently be proposing. If a member who has proposed this number of events wants to propose a new event, they must first delete an existing event.
// MAX_COINEM_PER_EVENT (with default value 5): the maximum coinem units that can be spent on one event by one member. 
// MAX_COINEM (with default value 20): the maximum number of coinem that a member can distribute to indicate interest level (from 0 to 5) in currently proposed events. If a member who has spent all their coinem on existing events wishes to indicate interest in another event, they must first remove coinem from other events. 
// NEXT_EVENT_UID (initialized to 1): The UID that will be used for the next event. This value is incremented every time a new event is created. 
export function Globals(props){
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


// EditGlobals allows the admin to change the Global Variables. User is alerted when they try inputting a value that's below the minimum.
export function EditGlobals(props) {
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


// AddMember allows the admin to create a new member by specifying the username, first name, and last name. The new username cannot be 'admin' or the username of an existing member.
export function AddMember(props) {
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


// Displays all members, including buttons to sort members and to add a new member. 
// Allows admin to sort by username, number of events planned, number of coinem spent by the member. Admin can also toggle between sorting by ascending or descending order.
export function Members(props){
    // Arrow functions to extract the number of events of a member and the number of coinem spent by a member
    let numEvents = (member) => props.events.map(e => e.planner).filter(e => e === member.username).length;
    let numCoinem = (member) => Object.values(member.coinem).reduce((n,sum) => n+sum, 0);

    const [memberData, setData] = React.useState(props.data.map((m) => {return {username: m.username, 
        firstname: m.firstname, lastname: m.lastname,
        coinem: m.coinem, numOfEvents: numEvents(m), 
        numOfCoinem: numCoinem(m)}}));
    const [sortType, setSortType] = React.useState("username");
    const [order, setOrder] = React.useState("ascending");
  
    // Sort array and set data
    function sortArray(array, type){
        if (type != "username") {
            // If sorting by number of events or number of coinem and there is a tie, breaks the tie using username
            let sorted = [...array].sort((a, b) => (a[type] - b[type] !== 0)?  (a[type] - b[type]):(a.username.localeCompare(b.username)));
            if (order == "descending"){
            sorted = sorted.reverse();  
            } 
            setData(sorted); }
        // Sorting by username
        else {
            let sorted = [...array].sort((a, b) => a.username.localeCompare(b.username));
            if (order == "descending"){
            sorted = sorted.reverse();
            } 
            setData(sorted);
        }
    }
    // Track changes in props.data due to modification to App's members list global state*/
    useEffect(() => {
        let mappedMembers = props.data.map((m) => {return {username: m.username, 
        firstname: m.firstname, lastname: m.lastname,
        coinem: m.coinem, numOfEvents: numEvents(m), 
        numOfCoinem: numCoinem(m)}});
        sortArray(mappedMembers, sortType);
        
    }, [props.data]);

    // Sort by a new criteria
    useEffect(() => {
        sortArray(memberData, sortType);
        }, [sortType, order]);


    function handleChange(){
        if(order == "ascending"){
            setOrder("descending");
        } else {
            setOrder("ascending");
        }
    };

    return(
        <div>
            <Container fluid>
                <Row>
                <Col md="auto">
                    <div className="headers">
                    <h3 className="inLineDivs">
                        Members
                    </h3>
                    <span className="inLineDivs">
                        {props.data.length}
                    </span>
                    </div>
                </Col>
                <Col md="auto">
                    <MUFormControl component="fieldset">
                    <FormLabel component="legend">Sorting Order</FormLabel>
                    <RadioGroup row aria-label="order" 
                                name="row-radio-buttons-group"
                                value={order}
                                onChange={() => handleChange()}
                    >
                        <FormControlLabel value="ascending" control={<Radio />} label="Ascending" />
                        <FormControlLabel value="descending" control={<Radio />} label="Descending" />
                    </RadioGroup>
                </MUFormControl>
                </Col>
                <Col md="auto">
                    <Dropdown>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="username" onClick={()=> setSortType("username")}>Username</Dropdown.Item>
                        <Dropdown.Item eventKey="numOfEvents" onClick={()=> setSortType("numOfEvents")}>Number of Events Planned</Dropdown.Item>
                        <Dropdown.Item eventKey="numOfCoinem" onClick={()=> setSortType("numOfCoinem")}>Number of Coinem Spent</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md="auto">
                    {/* Calls on AddMember and creates a button component */}
                    <AddMember submit={props.submit} members={props.data}></AddMember>
                </Col>
                </Row>
            </Container>
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
                {memberData.map(member => (
                    <tr key={member.username}>
                    <td>{member.username}</td>
                    <td>{member.firstname}</td>
                    <td>{member.lastname}</td>
                    <td>{member.numOfEvents}</td>
                    <td>{props.events.filter(e => e.planner === member.username).map(e => e.uid).join(', ')}</td>
                    <td>{member.numOfCoinem}</td>
                    <td>{Object.entries(member.coinem).map(c => '('+c[0]+','+c[1].toString()+')').join(', ')}</td>
                    <td><Button variant="outline-secondary" size="sm" onClick={() => props.deleteMember(member.username)}>
                            Delete
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>);
}


// Displays all members, and allows admin to sort by username, number of events planned, number of coinem spent by the member. Admin can also toggle between sorting by ascending or descending order.
export function Events (props) {
    let membersCoinem = props.members.map(member => [member.username, member.coinem]);
  
    const coinemSpent = (event) => membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => m[1][event.uid]).reduce((n,sum) => n+sum, 0);
    const numMembersInterested = (event) => membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).length;
  
    // uid, title, planner, description, numMembersInterested, coinemSpent
    const [eventData, setData] = React.useState(props.data.map((e) => {return {title: e.title, 
        uid: e.uid, planner: e.planner,
        description: e.description, numMembersInterested: numMembersInterested(e), 
        coinemSpent: coinemSpent(e)}}));
    const [sortType, setSortType] = React.useState("uid");
    const [order, setOrder] = React.useState("ascending");
  
    // Sort array and set data
    function sortArray(array, type){
        if (type != "title") {
            // If sorting by number of events or number of coinem and there is a tie, breaks the tie using username
            let sorted = [...array].sort((a, b) => (a[type] - b[type] !== 0)?  a[type] - b[type]:(a.uid - b.uid));
            if (order == "descending") {
                sorted = sorted.reverse();  
            } 
            setData(sorted); }
        // Sorting by title
        else {
            let sorted = [...array].sort((a, b) => a.title.localeCompare(b.title));
            if (order == "descending") {
                sorted = sorted.reverse();
            } 
            setData(sorted);
        }
    };
    
    // Track changes in props.data due to modification to App's events list global state*/
    useEffect(() => {
        let mappedEvents = props.data.map((e) => {return {title: e.title, 
            uid: e.uid, planner: e.planner,
            description: e.description, numMembersInterested: numMembersInterested(e), 
            coinemSpent: coinemSpent(e)}});
        sortArray(mappedEvents, sortType);
    }, [props.data]);
    
    // Sort by a new criteria
    useEffect(() => {
        sortArray(eventData, sortType);
    }, [sortType, order]);
  
    
    function handleChange(){
        if(order == "ascending"){
            setOrder("descending");
        } else {
            setOrder("ascending");
        }
    };
  
  
    return(
        <div>
            <Container fluid>
                <Row>
                <Col md="auto">
                    <h3 className="inLineDivs">Events</h3>
                    <span className="inLineDivs">
                    {props.data.length}
                    </span>
                </Col>
                <Col md="auto">
                    <MUFormControl component="fieldset">
                        <FormLabel component="legend">Sorting Order</FormLabel>
                        <RadioGroup row aria-label="order" 
                                    name="row-radio-buttons-group"
                                    value={order}
                                    onChange={() => handleChange()}
                        >
                        <FormControlLabel value="ascending" control={<Radio />} label="Ascending" />
                        <FormControlLabel value="descending" control={<Radio />} label="Descending" />
                        </RadioGroup>
                    </MUFormControl>
                </Col>
                <Col md="auto">
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        Sort by
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item eventKey="uid" onClick={()=> setSortType("uid")}>UID</Dropdown.Item>
                        <Dropdown.Item eventKey="title" onClick={()=> setSortType("title")}>Title</Dropdown.Item>
                        <Dropdown.Item eventKey="coinemSpent" onClick={()=> setSortType("coinemSpent")}>Coinem Spent</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                </Row>
            </Container>

            {eventData.map(event => (
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
