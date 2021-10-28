import './App.css';
import React from 'react';

var MAX_EVENTS = 3;
var MAX_COINEM_PER_EVENT = 5;
var MAX_COINEM = 20;
var NEXT_EVENT_UID = 1;

const Globals = props => (
  <div>
    <span className="dashboardElem">
      {MAX_EVENTS}<br/>
      max events
      <img src={"/icons/editing.png"}/>
    </span>
    <span className="dashboardElem">
      {MAX_COINEM_PER_EVENT}<br/>
      max coinem per event
    </span>
    <span className="dashboardElem">
      {MAX_COINEM}<br/>
      max coinem per user
    </span>
    <span className="dashboardElem">
      {NEXT_EVENT_UID}<br/>
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
    <button className="simpleButton">
      Add Member
    </button>
  </div>

)



class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      members : [],


    }
  }

  render(){
    return (
      <div>
        <header>Join'Em 
          <button>Admin</button>
          <button>Member</button>
        </header>
        <Globals></Globals>
        <Members data={this.state.members}></Members>
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
