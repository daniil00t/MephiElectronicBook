import React from 'react';
import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import EventEmmiter from "../../EventEmmiter.js";

export class Header extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.emmiter = props.emmiter;
	}
	changeTypeTable(type){
		// this.props.self.setState({activeTypeTable: type});
		// Cookies.set("reportType", type);
		// console.log({type: "number", data: type});
		this.emmiter.emit("changeTypeTable", {type: "number", data: type})
	}
	render() {
		return (
			<Navbar bg="light" expand="lg">
				<Link to="/" className="navbar-brand"><span className="mark-span">EL</span>Book</Link>
			  <Navbar.Toggle aria-controls="basic-navbar-nav" />

			  <Navbar.Collapse id="basic-navbar-nav">
			    <Nav className="ml-auto" style={{marginRight: "40px"}}>
			      <Link to="/personalPage" className="nav-link">Главная</Link>
			      <Link to="/personalPage/groups" className="nav-link">Мои группы</Link>
			      <Link to="/personalPage/subjects" className="nav-link">Мои предметы</Link>
			      <NavDropdown title="Мои ведомости" id="basic-nav-dropdown">
			        <Link onClick={e => this.changeTypeTable(0)} to="/personalPage/tables/att" className="dropdown-item">Ведомость посещаемости</Link>
			        <Link onClick={e => this.changeTypeTable(1)} to="/personalPage/tables/score" className="dropdown-item">Ведомость оценок</Link>
			      </NavDropdown>
			      
			      <Nav.Link href="#home">Помощь</Nav.Link>
			    </Nav>
			    <Form inline>
			      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
			      <Button variant="outline-success">Найти</Button>
			    </Form>
			  </Navbar.Collapse>
			</Navbar>
			);
		}
	}
