import { useEffect, useState } from 'react'
import axios from 'axios';
import "../../Assets/dashboard.css";
import DisplayCard from "../DisplayCard"

function Home() {
	const [objects, setObjects] = useState([]);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userDetails")) || {};
		axios.get('http://localhost:5000/api/v1/equipments').then((response) => {
			console.log(response.data);

			setObjects(response.data.data || []);
		}).catch((error) => {
			console.error("Error fetching equipments:", error);
		})
	}, []);

		return (
			<div className='home-container'>
				<DisplayCard
					objects={objects}
				/>
			</div>
		)
	}

export default Home