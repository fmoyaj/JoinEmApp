import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import editing from './icons/editing.png';
import coinem from './icons/coinem_icon.png'


const inputData = {
  "MAX_EVENTS": 3, 
  "MAX_COINEM_PER_EVENT": 5, 
  "MAX_COINEM": 20, 
  "NEXT_EVENT_UID": 13, 

  "members":
    [
      {"username": "alexaa", 
       "firstname": "Alex", 
       "lastname": "Aardvark", 
       "coinem": {
          "1": 3, 
          "6": 5,
          "11": 4,  
          "14": 2
        }
      }, 
      {"username": "fisher", 
       "firstname": "Bailey", 
       "lastname": "Bass", 
       "coinem": {                     
          "1": 5,
          "7": 1, 
          "8": 2, 
          "10": 3
        }
      }, 
      {"username": "ccamel", 
       "firstname": "Cameron", 
       "lastname": "Camel", 
       "coinem": {
          "2": 5,
          "5": 3, 
          "8": 3, 
          "10": 1, 
          "13": 5, 
          "14": 3
        }
      }, 
      {"username": "dyland", 
       "firstname": "Dylan", 
       "lastname": "Deer", 
       "coinem": {
          "1": 1,
          "2": 1, 
          "6": 3, 
          "7": 4, 
          "9": 3, 
          "11": 1, 
          "13": 3
        }
      }, 
      {"username": "emerm", 
       "firstname": "Emerson", 
       "lastname": "Ermine", 
       "coinem": {
          "1": 1,
          "3": 3,
          "5": 3, 
          "7": 1, 
          "9": 2, 
          "13": 3
        }
      }, 
      {"username": "finz", 
       "firstname": "Finley", 
       "lastname": "Flounder", 
       "coinem": {
          "1": 1,
          "3": 2, 
          "4": 3, 
          "5": 2, 
          "8": 1, 
          "10": 3, 
          "14": 3
        }
      }, 
      {"username": "gigi", 
       "firstname": "Greer", 
       "lastname": "Gecko", 
       "coinem": {
          "2": 1,
          "5": 2, 
          "6": 3, 
          "8": 1, 
          "10": 3, 
          "11": 5, 
          "14": 2
        }
      }, 
      {"username": "flyer", 
       "firstname": "Hayden", 
       "lastname": "Hawk", 
       "coinem": {
          "2": 1,
          "3": 1,
          "6": 3, 
          "7": 1, 
          "8": 3, 
          "10": 3, 
          "11": 1, 
          "14": 5
        }
      } 
     ], 
 
  "events": 
    [
      {"uid": 1, 
       "title": "Introductory Glass Blowing",
       "description" : "Let's gather a group for an intro glass blowing class at Diablo Glass in Boston. Aiming for a Tue/Wed night in November.", 
       "planner": "gigi"
       },

      {"uid": 2, 
       "title": "Whale Watching",
       "description" : "Organizing a weekend whale watching group from Gloucester via Cape Ann Whale Watch (https://www.seethewhales.com/).", 
       "planner": "finz"
       },
      {"uid": 3, 
       "title": "Disc golf at Borderlands", 
       "description" : "Have you ever played disc golf? It's a fun activity for newbies and there's a nice course a Borderlands. Parts of Knives Out were filmed in the mansion there! Looking to form a foursome.",
       "planner": "dyland"
       },
      {"uid": 4, 
       "title": "Passion for Pumpkins!",
       "description" : "I love carving jack-o-lanterns and would like to teach my craft to others. This is is a fun event with Halloween around the corner. Plus we'll raost the pumpkin seeds and eat them.", 
       "planner": "alexaa"
       },
      {"uid": 5, 
       "title": "Blue Hills Hike", 
       "description" : "Fall is a fantastic time for a hike! The Fall colors in the Blue Hils are amazing. I'm planning a hike of the Skyline Trail on Saturday, November 6. Join me!", 
       "planner": "flyer"
       },
      {"uid": 6, 
       "title": "Forest Edibles",
       "description" : "Squirrels aren't the only ones finding food in the forest. I'll show you lots of things that people can eat in the forest. After all the rain this summer, mushrooms are everywhere! I'm leading a trip in the Noanet Woodlands on Sun Oct. 31.", 
       "planner": "emerm" 
       },
      {"uid": 7, 
       "title": "Beginning Knitting", 
       "description" : "Fall and Winter are a great time to learn knitting. I'll show you the basics, including how to cast on, knit, purl, and bind off. Classes will run Thursdays@7pm Nov 3 through Dec 8, except Thanksgiving (Nov 25).",
       "planner": "alexaa"
       },
      {"uid": 8, 
       "title": "Apple Picking and Pies",
       "description" : "Fall is apple picking time! Tangerini Farm in Medway has a great orchard. After picking, let's make apple pie and tarte tartin (my favorite). Let's figure out a good time for this.", 
       "planner": "alexaa"
       },
      {"uid": 9, 
       "title": "Baker Estate?",
       "description" : "I've been reading about the history of the Baker Estate in Wellesley and want to learn more, including exploring the ruins of the old estate. Anyone want to join me?", 
       "planner": "fisher"
       },
      {"uid": 10, 
       "title": "Minuteman Bike Trail",
       "description" : "I'm planning a bike trip on the Minuteman Bike Trail from Lincoln Center to Davis Square and back. Tenatively for Sat. Oct. 30. Care to join me?", 
       "planner": "dyland"
       },
      {"uid": 11, 
       "title": "Chocolate Tasting?",
       "description" : "I hear Taza Chocolate in Somerville has a great tour and chocolate tasting. I'd like to organize a group to do this. Who's interested?", 
       "planner": "finz" 
       },
      {"uid": 12, 
       "title": "Whist Group!",
       "description" : "I'm looking to organize a group to play whist at a regular weekly time. Anyone interest in this?", 
       "planner": "emerm"
       },
      {"uid": 13, 
       "title": "BSO Tchaikovsky/Dvořák Nov 4-6",
       "description" : "The Boston Symphony Orchestra has a Tchaikovsky/Dvořák weekend Nov 4-6 featuring pianist Beatrice Rana and conductor Dima Slobodeniouk. I'd love to go, but don't want to go alone. Who wants to go with me? What date is best for you?",
       "planner": "gigi"
      },
      {"uid": 14, 
       "title": "Algorithmic Inequality Reading Group",
       "description" : "I'm organizing a reading group on algorithmic inequality. Books will include Noble's \"Algorithms of Oppression\", Eubanks's \"Automating Inequality\", and O'Neils's \"Weapons of Math Destruction\". Join me! Are there other books we should add to the list?",
       "planner": "dyland"
       }

    ]
}

const Globals = props => (
  <div>
    <span className="dashboardElem">
      {props.maxEvents}<br/>
      max events
      <img src={editing} width="16" height="16"/>
    </span>
    <span className="dashboardElem">
      {props.maxCoinemEvent}<br/>
      max coinem per event
      <img src={editing} width="16" height="16"/>
    </span>
    <span className="dashboardElem">
      {props.maxCoinem}<br/>
      max coinem per user
      <img src={editing} width="16" height="16"/>
    </span>
    <span className="dashboardElem">
      {props.nextUID}<br/>
      next event UID
      <img src={editing} width="16" height="16"/>
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

const EventPopover = props => (
  <Popover id="popover-basic">
    <Popover.Header as="h3">{props.membersInterested + " members interested:"}</Popover.Header>
    <Popover.Body>
      {props.message}
    </Popover.Body>
  </Popover>
);

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
        <h5 class="card-header">{event.uid.toString() + " " + event.title}</h5>
        <div class="card-body">
          <h5 class="card-title">{event.planner}</h5>
          <p class="card-text">{event.description}</p>
           <EventPopover message={props.members.map(m => [m.username, m.coinem]).filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).map(m => [m[0], m[1][event.uid]]).join('\n')} 
                          membersInterested={props.members.map(m => [m.username, m.coinem]).filter(m => (Object.keys(m[1]).includes((event.uid).toString()))).length}></EventPopover>
        </div>
      </div>
    ))}
  </div> )
  }

// <img src={coinem} width="16" height="16"></img>

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      MAX_EVENTS: 3,
      MAX_COINEM_PER_EVENT: 5,
      MAX_COINEM: 20,
      NEXT_EVENT_UID: 1,
      members : inputData.members,
      newMember : {username: '', name: '', lastname: '', coinem: 0,},
      events: inputData.events,
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
        <ErrorBoundary>
        <Members data={this.state.members} 
                  events={this.state.events}
                  newMember={this.state.newMember} 
                  handleInputChange={this.handleInputChange}
                  submit={this.handleNewUser}
                  deleteMember={this.deleteMember}>
        </Members>
        </ErrorBoundary>
        <Events data={this.state.events} members={this.state.members}></Events>
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
