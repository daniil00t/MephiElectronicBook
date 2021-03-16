import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './styles/App.css';
import { PersonPage, AuthPanel } from "./Components/index.js";
import Home from "./Components/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';




export default class App extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
	  return (
	    <Router>
	      <Switch>
	        <Route path="/auth">
	          <AuthPanel/>
	        </Route>
	        <Route path="/personalPage/tables/att">
          		<PersonPage match={"table-att"}/>
	        </Route>
	        <Route path="/personalPage/tables/score">
          		<PersonPage match={"table-score"}/>
	        </Route>
	        <Route path="/personalPage/groups">
          		<PersonPage match={"groups"}/>
	        </Route>
	        <Route path="/personalPage/subjects">
          		<PersonPage match={"subjects"}/>
	        </Route>
	        <Route path="/personalPage">
          		<PersonPage match={"main"}/>
	        </Route>

	        <Route path="/">
	          <Home />
	        </Route>
	      </Switch>
	    </Router>
	  );
	}
}