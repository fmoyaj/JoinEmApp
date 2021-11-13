// Member.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Container, InputGroup, FormControl, Row, Col} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import coinem from './icons/coinem_icon.png'
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MaterialButton from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {RadioGroup, Radio, FormLabel, FormControlLabel} from '@material-ui/core';
import MUFormControl from '@material-ui/core/FormControl';
import { lightBlue } from '@material-ui/core/colors';

// 'export' in front of the functions will allow the functions to be imported in other files, like App.js

/* Member View Components */

/* Stats displays a the number of events a given member has left to plan and the number a coinem a given 
   member has left to spend*/
export function Stats(props) {
    let member = props.members.filter(m => m.username === props.user)[0];
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
    </div>)
  }
  
  /* Renders table of users in member view as well as sorting functionality */
  export function MemberView(props){
  // Arrow functions to extract the number of events of a member and the number of coinem spent by a member
  let numEvents = (member) => props.events.map(e => e.planner).filter(e => e === member.username).length;
  let numCoinem = (member) => Object.values(member.coinem).reduce((n,sum) => n+sum, 0);
  
  /* Hook state variables: memberData, which is the sorted list of members 
    being displayed;  sortType, which is the chosen sorting type 
    (username (default), num of events planned, num of coinem spent 
    on events), and order (ascending (default) or descending)*/
  const [memberData, setData] = React.useState(props.data.map((m) => {return {username: m.username, 
    firstname: m.firstname, lastname: m.lastname,
    coinem: m.coinem, numOfEvents: numEvents(m), 
    numOfCoinem: numCoinem(m)}}));
  const [sortType, setSortType] = React.useState("username");
  const [order, setOrder] = React.useState("ascending");
  const [active, setActive] = React.useState({username: false, numOfCoinem: false, numOfEvents: false});
  
  // Sort array and set data
  function sortArray(array, type){
    if (type !== "username") {
      // If sorting by number of events or number of coinem and there is a tie, breaks the tie using username
      let sorted = [...array].sort((a, b) => (a[type] - b[type] !== 0)?  (a[type] - b[type]):(a.username.localeCompare(b.username)));
      if (order === "descending"){
        sorted = sorted.reverse(); // Reverse sorted list to give descending order
      } 
      setData(sorted); }
    // Sorting by username
    else {
      let sorted = [...array].sort((a, b) => a.username.localeCompare(b.username));
      if (order === "descending"){
        sorted = sorted.reverse(); // Reverse sorted list to give descending order
      } 
      setData(sorted);
    }
    };
  
  /* Track changes in props.data due to modification to App's members 
  list global state*/
  useEffect(() => {
      let mappedMembers = props.data.map((m) => {return {username: m.username, 
        firstname: m.firstname, lastname: m.lastname,
        coinem: m.coinem, numOfEvents: numEvents(m), 
        numOfCoinem: numCoinem(m)}});
      sortArray(mappedMembers, sortType);
      
    }, [props.data]);
  
  // Sort by a new criteria if sortType or order has changed
  useEffect(() => {
      sortArray(memberData, sortType);
      let newActive = Object.fromEntries(Object.keys(active).map( k => (k !== sortType)? [k, false]:[k, true]));
      setActive(newActive);

    }, [sortType, order]);
  
  // Helper function changing order (hook state variable)
  function handleChange(){
    if(order === "ascending"){
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
          <Container small>
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
          </Container>
        </Col>
        <Col md="auto">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Sort by
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item active={active.username} eventKey="Username" onClick={()=> setSortType("username")}>Username</Dropdown.Item>
              <Dropdown.Item active={active.numOfEvents} eventKey="Number of events planned" onClick={()=> setSortType("numOfEvents")}>Number of events planned</Dropdown.Item>
              <Dropdown.Item active={active.numOfCoinem} eventKey="Number of coinem spent" onClick={()=> setSortType("numOfCoinem")}>Number of coinem spent</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
    <Table striped border hover="true">
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
  
  // Button and modal to create a new event or edit existing event
  export function ModifyEvent(props) {
    const [show, setShow] = useState(false);
    const [currentTitle, setCurrentTitle] = useState(props.initialTitle);
    const [currentDescription, setCurrentDescription] = useState(props.initialDescription);
    /* State variable to keep track if component is being used to 
        create a new event or to modify an existing event */
    const [newEvent, setNewEvent] = useState(props.newEvent);
    // Events created by current user
    let memberEvents = props.events.map(e => e.planner).filter(e => e === props.currentUser);
    let style = newEvent? "dark":"outline-secondary"; // Modifying event button has style dark and new event has style outline
    let size = newEvent? "":"sm"; // When modifying event use a small button
  
    function handleClose() {
      setShow(false);
      if (newEvent){
      setCurrentTitle("");
      setCurrentDescription("");
      }
    }
    function handleSubmit() {
      if (currentTitle !== "" && currentDescription !== ""){
        setShow(false);
        // If this event title has been used, prompt user to enter new title
        if((newEvent && memberEvents.length < props.MAX_EVENTS
          && !props.events.map( e => e.title).includes(currentTitle)) || 
          (newEvent && memberEvents.length === props.MAX_EVENTS)) {
            setCurrentTitle("");
            setCurrentDescription(""); }
      }
    }

    const handleOpen = () => setShow(true);
    
    // Updates event title and description
    function updateValue(e){
      const target = e.target;
  
      switch(target.ariaLabel){
        case "title":
          setCurrentTitle(target.value);
          break;
        case "description":
          setCurrentDescription(target.value);
          break;

        // No default
      }
    }
  
    return (
      <>
        <Button variant={style} size={size} onClick={handleOpen}>
          {props.buttonTitle}
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{props.buttonTitle}</Modal.Title>
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
            { newEvent &&
            <Button variant="primary" onClick={() => {props.handleNewEvent(currentTitle, currentDescription); handleSubmit()}}>
              Submit
            </Button>
            }
            { !newEvent &&
            <Button variant="primary" onClick={() => {props.handleEditEvent(currentTitle, currentDescription, props.initialUid); handleSubmit()}}>
              Submit
            </Button>
            }
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  // Card that displays the current event
  export function DisplayEvent(props){
    let membersCoinem = props.members.map(member => [member.username, member.coinem]);
    let currentCoinemSpent = 0;
    // Calculate all coinem spent by members in an event
    if (props.members.filter(member => member.username===props.currentUser)[0].coinem[props.event.uid] === undefined) {
      currentCoinemSpent = 0;
    } else {
      currentCoinemSpent = props.members.filter(member => member.username===props.currentUser)[0].coinem[props.event.uid]
    }
    
    return (<div>
      {props.event.planner === props.currentUser && 
      <div className="card">
          <h5 className="card-header" style={{ display: 'flex'}}>
            {props.event.uid.toString() + ". " + props.event.title}
          </h5>
          <div className="card-body">
            <Row>
              <Col md="10">
                <h5 className="card-title">{props.event.planner}</h5>
                <p className="card-text">{props.event.description}</p>
                  <div className="card-mainDetails"> 
                    <OverlayTrigger trigger="hover" placement="top" overlay={<Popover className="popover" >
                      {"Members interested: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).length +  ('\n\n(') + 
                      membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => [m[0], m[1][props.event.uid]]).join('\n') + (')' + 
                      "\nTotal coinem: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0))
                      }
                      </Popover>}>
                    <Button variant="light"><img src={coinem} className="icons"/>{" " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0)}</Button>
                    </OverlayTrigger>
                  </div>
              </Col>
              <Col md="2">
                  <Row>
                    <Col md="auto" className = "my-auto">
                      <ModifyEvent events={props.events} handleEditEvent={props.handleEditEvent} handleNewEvent={props.handleNewEvent} 
                                    currentUser={props.currentUser} MAX_EVENTS={props.MAX_EVENTS} deleteEvent={props.deleteEvent} 
                                    initialTitle={props.event.title} initialDescription={props.event.description} 
                                    initialUid={props.event.uid} buttonTitle={"Edit"} newEvent={false}></ModifyEvent>
                    </Col>
                    <Col md="auto" className = "my-auto">
                    <Button variant="outline-secondary" size="sm" 
                            style={{ marginLeft: "auto" }}
                            onClick={() => props.deleteEvent(props.event.uid)}>
                      Delete
                    </Button>
                    </Col>
                  </Row>
              </Col>
            </Row>
          </div>
        </div>}
        {props.event.planner !== props.currentUser && 
      <div className="card">
          <h5 className="card-header" style={{ display: 'flex'}}>
            {props.event.uid.toString() + ". " + props.event.title}
          </h5>
          <div className="card-body">
            <Row>
              <Col md="10">
                <h5 className="card-title">{props.event.planner}</h5>
                <p className="card-text">{props.event.description}</p>
                    <OverlayTrigger trigger="hover" placement="top" overlay={<Popover className="popover" >
                      <div>
                        <p>
                          {"Members interested: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).length +  ('\n\n(') + 
                          membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => [m[0], m[1][props.event.uid]]).join('\n') + ')'}
                        </p>
                        <div className="sep"></div>
                        <p>
                            {("Total coinem: " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0))}
                        </p>
                        </div>
                        </Popover>}>
                      <Button variant="light"><img src={coinem} className="icons"/>{" " + membersCoinem.filter(m => (Object.keys(m[1]).includes((props.event.uid).toString()))).map(m => m[1][props.event.uid]).reduce((n,sum) => n+sum, 0)}</Button>
                    </OverlayTrigger>
              </Col>
              <Col md="2" className = "my-auto">
                <div className="coinemSpentOnEvent">{currentCoinemSpent} coinem spent</div>
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
              </Col>
            </Row>
          </div>
        </div>}
        </div>); 
  }
  
  /* Display events for the member view. Different display of events
    based on whether the current user is the event's planner or not */
  export function MemberEvents (props) {
    // Coinem that all members have spent in events
    let membersCoinem = props.members.map(member => [member.username, member.coinem]);
  
    /* Anonymous function to calculate the coinem spent in an event 
    and the number of members interested in a given event*/
    const coinemSpent = (event) => membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => m[1][event.uid]).reduce((n,sum) => n+sum, 0);
    const numMembersInterested = (event) => membersCoinem.filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).length;
  
    /* Set state variables. Set eventData to be a list of objects 
    representing the events*/
    const [eventData, setData] = React.useState(props.data.map((e) => {return {title: e.title, 
      uid: e.uid, planner: e.planner,
      description: e.description, numMembersInterested: numMembersInterested(e), 
      coinemSpent: coinemSpent(e)}}));
    const [sortType, setSortType] = React.useState("uid"); // Set default sorting type
    const [order, setOrder] = React.useState("ascending"); // Set default sorting order
    const [filter, setFilter] = React.useState("all"); // See all events
    const [active, setActive] = React.useState({uid: false, title: false, coinemSpent: false}); // Which option in dropdown is active
    const [active2, setActive2] = React.useState({all: false, ownEvents: false, otherEvents: false, spentCoinem: false, notSpentCoinem: false});

    // Sort array and set data
    function sortArray(array, type){
      if (type !== "title") {
        // If sorting by number of events or number of coinem and there is a tie, breaks the tie using username
        let sorted = [...array].sort((a, b) => (a[type] - b[type] !== 0)?  a[type] - b[type]:(a.uid - b.uid));
        if (order === "descending"){
          sorted = sorted.reverse(); // Reverse order if sorting order is descending
        } 
        setData(sorted); }
      // Sorting by title
      else {
        let sorted = [...array].sort((a, b) => a.title.localeCompare(b.title));
        if (order === "descending"){
          sorted = sorted.reverse(); // Reverse order if sorting order is descending
        } 
        setData(sorted);
      }
      };

      function filterArray(filter){
        let allEvents = props.data.map((e) => {return {title: e.title, 
          uid: e.uid, planner: e.planner,
          description: e.description, numMembersInterested: numMembersInterested(e), 
          coinemSpent: coinemSpent(e)}});
        let filteredData;
        let uidEventsSpentCoinem = Object.keys(props.members.find(m => m.username === props.currentUser).coinem);

        switch(filter){
          case "all":
            filteredData = allEvents;
            break;
          case "ownEvents":
            filteredData = allEvents.filter(e => e.planner === props.currentUser);
            break;
          case "otherEvents":
            filteredData = allEvents.filter(e => e.planner !== props.currentUser);
            break;
          case "spentCoinem":
            filteredData = allEvents.filter(e => uidEventsSpentCoinem.includes(e.uid.toString()));
            break;
          case "notSpentCoinem":
            filteredData = allEvents.filter(e => !uidEventsSpentCoinem.includes(e.uid.toString()) && e.planner !== props.currentUser);
            break;
          // No default
          }
        
          sortArray(filteredData);

      }

      useEffect(() => {
        filterArray(filter);
        let newActive = Object.fromEntries(Object.keys(active2).map( k => (k !== filter)? [k, false]:[k, true]));
        setActive2(newActive);
      }, [filter]
      );
    
    /* Track changes in props.data due to modification to App's events list global state. 
       Tracks if a new event was created or deleted or if sortType was changed to sort list*/
    useEffect(() => {
        let mappedEvents = props.data.map((e) => {return {title: e.title, 
          uid: e.uid, planner: e.planner,
          description: e.description, numMembersInterested: numMembersInterested(e), 
          coinemSpent: coinemSpent(e)}});
        sortArray(mappedEvents, sortType);
        setFilter(filter.split('').join('')); // Prompt list re-filtering and re-redndering
      }, [props.data]);
    
    // Sort by a new criteria if sortType or order are changed
    useEffect(() => {
        sortArray(eventData, sortType);
        let newActive = Object.fromEntries(Object.keys(active).map( k => (k !== sortType)? [k, false]:[k, true]));
        setActive(newActive);
      }, [sortType, order]);
  
    
    // Updates order
    function handleChange(){
      if(order === "ascending"){
        setOrder("descending");
      } else {
        setOrder("ascending");
      }
    };
  
    return(
    <div>
      <Container fluid style={{
      paddingTop: '20px'
    }}>
        <Row>
          <Col md="auto">
            <h3 className="inLineDivs">Events</h3>
            <span className="inLineDivs">
              {eventData.length}
            </span>
          </Col>
          <Col md="auto">
            <Container small>
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
            </Container>
          </Col>
          <Col md="auto">
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  Sort by
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item active={active.uid} eventKey="uid" onClick={()=> setSortType("uid")}>UID</Dropdown.Item>
                  <Dropdown.Item active={active.title} eventKey="title" onClick={()=> setSortType("title")}>Title</Dropdown.Item>
                  <Dropdown.Item active={active.coinemSpent} eventKey="coinemSpent" onClick={()=> setSortType("coinemSpent")}>Coinem spent</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md="auto">
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu> 
                  <Dropdown.Item active={active2.all} eventKey="allEvents" onClick={()=> setFilter("all")}>All events</Dropdown.Item>
                  <Dropdown.Item active={active2.ownEvents} eventKey="ownEvents" onClick={()=> setFilter("ownEvents")}>My events</Dropdown.Item>
                  <Dropdown.Item active={active2.otherEvents} eventKey="otherEvents" onClick={()=> setFilter("otherEvents")}>Events planned by others</Dropdown.Item>
                  <Dropdown.Item active={active2.spentCoinem} eventKey="spentCoinem" onClick={()=> setFilter("spentCoinem")}>Events supported</Dropdown.Item>
                  <Dropdown.Item active={active2.notSpentCoinem} eventKey="notSpentCoinem" onClick={()=> setFilter("notSpentCoinem")}>Events not supported</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md="auto">
          <ModifyEvent events={props.data} handleNewEvent={props.handleNewEvent} currentUser={props.currentUser} MAX_EVENTS={props.MAX_EVENTS} deleteEvent={props.deleteEvent} initialTitle={""} initialDescription={""} buttonTitle={"New Event"} newEvent={true}></ModifyEvent>
          </Col>
        </Row>
      </Container>
      {eventData.map(e => (
        <DisplayEvent event = {e} members={props.members} currentUser={props.currentUser} deleteEvent={props.deleteEvent} toggleCoinemSpent={props.toggleCoinemSpent} events={props.data} handleNewEvent={props.handleNewEvent} handleEditEvent={props.handleEditEvent} MAX_EVENTS={props.MAX_EVENTS}></DisplayEvent>
      ))}
    </div> )
    }
    
    /* Renders button to delete given member's account and modal to 
    confirm account deletion */

    export function DeleteAccount(props) {
      const [show, setShow] = useState(false);
      
      function handleClose() {
        setShow(false);
      }
  
      function handleConfirm(username) {
        setShow(false);
      }
  
      const handleOpen = () => setShow(true);
    
      return (
        <>
          <Container flex>
            <div style={{display: 'flex', justifyContent: 'center', padding:'5%'}}>
              <Button variant="danger"onClick={handleOpen}>
                Delete Account
              </Button>
            </div>
          </Container>
          <Modal show={show} onHide={handleClose}>
            <Modal.Body>
              Are you sure you would like to delete your account? This action cannot be reversed.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {props.deleteMember(props.currentUser); handleConfirm()}}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }