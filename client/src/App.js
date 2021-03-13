import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import ee from "./EventEmmiter.js";
import './styles/App.css';
import { PersonPage, AuthPanel } from "./Components/index.js";
import Home from "./Components/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';




export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			id: -1
		};
	}


	componentDidMount(){
		// ee.on("changeNameIdTeacher", (data) => {
		// 	console.log(data);
		// 	// this.setState({id: data.id});
		// })
	}
	render(){
		// console.log(useParams());
	  return (
	    <Router>
	      <Switch>
	        <Route path="/auth">
	          <AuthPanel/>
	        </Route>
	        <Route path="/personalPage/tables/att">
          	<PersonPage id={this.state.id} match={"table-att"}/>
	        </Route>
	        <Route path="/personalPage/tables/score">
          	<PersonPage id={this.state.id} match={"table-score"}/>
	        </Route>
	        <Route path="/personalPage/groups">
          	<PersonPage id={this.state.id} match={"groups"}/>
	        </Route>
	        <Route path="/personalPage/subjects">
          	<PersonPage id={this.state.id} match={"subjects"}/>
	        </Route>
	        <Route path="/personalPage">
          	<PersonPage id={this.state.id} match={"main"}/>
	        </Route>

	        <Route path="/">
	          <Home />
	        </Route>
	      </Switch>
	    </Router>
	  );
	}
}

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Topics() {
//   let match = useRouteMatch();

//   return (
//     <div>
//       <h2>Topics</h2>

//       <ul>
//         <li>
//           <Link to={`${match.url}/components`}>Components</Link>
//         </li>
//         <li>
//           <Link to={`${match.url}/props-v-state`}>
//             Props v. State
//           </Link>
//         </li>
//       </ul>

//       {/* The Topics page has its own <Switch> with more routes
//           that build on the /topics URL path. You can think of the
//           2nd <Route> here as an "index" page for all topics, or
//           the page that is shown when no topic is selected */}
//       <Switch>
//         <Route path={`${match.path}/:topicId`}>
//           <Topic />
//         </Route>
//         <Route path={match.path}>
//           <h3>Please select a topic.</h3>
//         </Route>
//       </Switch>
//     </div>
//   );
// }

// function Topic() {
//   let { topicId } = useParams();
//   return <h3>Requested topic ID: {topicId}</h3>;
// }
