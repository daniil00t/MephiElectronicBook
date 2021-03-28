import React from 'react'
import { Link } from "react-router-dom"
import { Button, Card } from "react-bootstrap"
import Cookies from "js-cookie"
import "../styles/Home.css"

export default class Home extends React.Component {
	constructor(props) {
		super(props)
	}

	switcher(){
		if(Cookies.get("id") != -1){
			return (
					<Link to="/personalPage" class="button_links">
						<Button variant="primary">
							На страницу
						</Button>
					</Link>
			)
		}
		else{
			return (
				<Link to="/auth" class="button_links">
					<Button variant="success">
						Авторизация
					</Button>
				</Link>
		)
		}
	}
	ItemCards(props){
		return (
			<Card style={{ width: '18rem' }} className={props.className}>
				<Card.Img variant="top" src={`/media/images/article_${props.id}.jpg`} />
				<Card.Body>
					<Card.Title>{props.title}</Card.Title>
					<Card.Text>
						{props.text}
					</Card.Text>
					<Link to={props.linkHref}><Button variant="primary">{props.linkName}</Button></Link>
				</Card.Body>
			</Card>
		)
	}
	render() {
		return (
			<div className="container">
					<div className="row wrap_links">
						<h2 class="home_welcome">Добро пожаловать в ELBook!</h2>
						{this.switcher()}
					</div>
					<hr />
					<div className="row">
						<div className="col-lg-4 col-md-6 dfjcc">
							<this.ItemCards 
								className="card_home"
								id={1}
								title="Первая новость!"
								text="Привет! Это первая новость. Мы начинаем разработку ведомостей и в дальнейшем выложим наши результаты"
								linkHref="/personalPage/tables/att"
								linkName="Посмотреть"
							/>
						</div>
						<div className="col-lg-4 col-md-6 dfjcc">
							<this.ItemCards 
								className="card_home"
								id={2}
								title="Вторая новость!"
								text="Привет! Это первая новость. Мы начинаем разработку ведомостей и в дальнейшем выложим наши результаты"
								linkHref="/personalPage/tables/att"
								linkName="Посмотреть"
							/>
						</div>
						<div className="col-lg-4 col-md-6 dfjcc">
							<this.ItemCards 
								className="card_home"
								id={3}
								title="А что, похоже!"
								text="Мы думаем, что именно так мы выглядим в мире разработки"
								linkHref="/personalPage/tables/att"
								linkName="Посмотреть"
							/>
						</div>
					</div>
			</div>
		);
	}
}
