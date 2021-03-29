import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import PersonPage 	from "./Components/PersonPage"
import AuthPanel 		from "./Components/AuthPanel"
import Home 			from "./Components/Home";
import { Footer } 	from "./Components/PersonPage/Footer"
import Notification 	from "./Components/PersonPage/Notification"

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// use redux
import { initGlobal } from "./redux/actions"
import { connect } from "react-redux"

const App = (props) => {
	// const notification = useSelector(state => state.notification)
	return (
		<Router>
			<Switch>
				<Route path="/auth">
					<AuthPanel/>
					{console.log(props.notification)}
					<Notification 
						type={props.notification.type}
						title={props.notification.title} 
						time="1 second ago" 
						description={props.notification.content} 
						visible={props.notification.visible}
					/>
					<Footer />
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
					<Footer />
				</Route>
			</Switch>
		</Router>
	)
}

const mapStateToProps = (state) => ({
	notification: state.app.notification
})
const mapDispatchToProps = dispatch => ({
	initGlobal: () => dispatch(initGlobal())
})

export default connect(mapStateToProps, null)(App);