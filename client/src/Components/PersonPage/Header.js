import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

// Redux is used
import { useDispatch, connect } from "react-redux"
import { changeTypeReport } from "../../redux/actions"


const Header = (props) => {
	const dispatch = useDispatch()


	const changeTypeTable = (type) => {
		dispatch(changeTypeReport(type))
		// console.log(props);
	}
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
					<Link onClick={e => changeTypeTable("att")} to="/personalPage/tables/att" className="dropdown-item">Ведомость посещаемости</Link>
					<Link onClick={e => changeTypeTable("score")} to="/personalPage/tables/score" className="dropdown-item">Ведомость оценок</Link>
					<Link onClick={e => changeTypeTable("ch")} to="/personalPage/tables/score" className="dropdown-item">Итоговая ведомость</Link>
				</NavDropdown>
				
				<Nav.Link href="#home">Помощь</Nav.Link>
				</Nav>
				<Form inline>
				<FormControl type="text" placeholder="Search" className="mr-sm-2" />
				<Button variant="outline-success">Найти</Button>
				</Form>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default connect()(Header)