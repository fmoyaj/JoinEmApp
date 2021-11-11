import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Accordion, Button, Navbar, Nav, Dropdown, Row, Col} from 'react-bootstrap';
import { Globals, Members, Events } from './Admin.js';
import { Stats, MemberView, MemberEvents, DeleteAccount } from './Member.js';
import upload from './icons/upload.png';
import download from './icons/download.png';
import {Card, CardContent, Typography, Grid} from '@material-ui/core';


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
    this.handleEditEvent = this.handleEditEvent.bind(this);
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

      // No default
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
                  events: this.state.events.filter(e => e.planner !== username), 
                currentUser: "admin"});
    

  }

  deleteEvent(uid){
    this.setState({events: this.state.events.filter(e => e.uid !== uid),
                    members: this.state.members.map(m => {return {...m, coinem: Object.keys(m.coinem).filter(key =>
                      key !== uid.toString()).reduce((obj, key) =>
                      {
                          obj[key] = m.coinem[key];
                          return obj;
                      }, {} // Turns coinem list into an object -- acts like .fromEntries
                  )}})});
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
      // No default
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
  }

  /* Member-specific methods */
  handleNewEvent(newTitle, newDescription){
    let memberEvents = this.state.events.map(e => e.planner).filter(e => e === this.state.currentUser);

    if(newTitle !== "" && newDescription !== "" 
      && memberEvents.length < this.state.MAX_EVENTS && !this.state.events.map( e => e.title).includes(newTitle)){
        this.setState({events: [...this.state.events, {uid: this.state.NEXT_EVENT_UID, title: newTitle, description: newDescription, planner: this.state.currentUser}], 
        NEXT_EVENT_UID: this.state.NEXT_EVENT_UID + 1});
    }
    else{
      if(newTitle === "" || newDescription === ""){
        alert("Please fill out all text fields before submitting!");  
      }
      else if(memberEvents.length === this.state.MAX_EVENTS){
        alert("You have reached the maximum number of events you can plan." +  
        " You cannot plan a new event until another event has been deleted.");  
      }
      // User chooses non-unique title
      else {
        alert("Event title already taken. Please choose a unique title for your event.")
      }
    }
  }

  handleEditEvent(title, description, currentUid){
    let index = this.state.events.indexOf(this.state.events.filter(e => e.uid === currentUid)[0]);
    let updatedEvents = this.state.events.filter(e => e.uid !== currentUid);
    updatedEvents.splice(index, 0, {uid: currentUid, title: title, description: description, planner: this.state.currentUser});
    if(title !== "" && description !== "") {
        this.setState({events: updatedEvents});
    }
    else{
      if(title === "" || description === ""){
        alert("Please fill out all text fields before submitting!");  
      }
    }
  }



  toggleCoinemSpent(currentCoinemSpent, operation, uid){
    let currentUserInfo = this.state.members.filter(member => member.username===this.state.currentUser)[0]
    let coinemSpentAllEvents = Object.values(currentUserInfo.coinem).reduce((n, sum) => n + sum, 0);
    let currentCoinem = currentUserInfo.coinem[uid] === undefined? 0:currentUserInfo.coinem[uid];

    if (currentCoinemSpent <= this.state.MAX_COINEM_PER_EVENT) {
      // Addition
      if(operation === "increase" && currentCoinemSpent < this.state.MAX_COINEM_PER_EVENT 
          && coinemSpentAllEvents < this.state.MAX_COINEM
          ) {
        let newValue = currentCoinem  + 1;
        let newCoinem = {...currentUserInfo.coinem, [uid]: newValue};
        this.setState({members:[...this.state.members.filter(member => member.username!==this.state.currentUser), {...currentUserInfo, coinem: newCoinem}]});
      }
      // Substraction
      if(operation === "reduce" && currentCoinemSpent>0 && coinemSpentAllEvents > 0){
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
                      {sortStringList(this.state.members, "username").map(m =>
                        <Dropdown.Item eventKey={m.username} onClick={()=> this.becomeMember(m.username)}>{m.username}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          { this.state.currentUser === "admin" &&
            <Container fluid>
              <div>
                  <Row>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                              Database Management
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={2}>
                                  <Button className="btn btn-light" onClick={this.downloadHandler}>
                                    <img src={download} className="icons"/>
                                    {" Download file"}
                                  </Button>
                              </Grid>
                              <Grid item xs={2}>
                                <Button className="btn btn-light" onClick={this.uploadHandler}>
                                <img src={upload} className="icons"/>
                                {" Upload file"}
                                </Button>
                              </Grid>
                            </Grid>
                        </CardContent>
                      </Card>
                  </Row>
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
                          deleteMember={this.deleteMember}
                          currentUser={this.state.currentUser}>
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
                <pre className="hidden">{this.state.fileInfo}</pre>
              </div> 
            </Container>
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
                    MAX_EVENTS={this.state.MAX_EVENTS}
                    handleEditEvent={this.handleEditEvent}>
          </MemberEvents>
          <DeleteAccount 
                    deleteMember={this.deleteMember} 
                    currentUser = {this.state.currentUser}>
          </DeleteAccount>
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

/*Sorts strings by some given criteria and returns a sorted list in ascending order. Takes in a list of strings and a criteria
as a string*/
function sortStringList(list, criteria){
  return [...list].sort((a, b) => a[criteria] < b[criteria] ? -1 : 1 );
}



export default App;
