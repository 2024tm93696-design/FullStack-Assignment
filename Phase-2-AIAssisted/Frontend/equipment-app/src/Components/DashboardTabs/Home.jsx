import { useEffect, useState } from 'react'
import axios from 'axios';
import "../../Assets/dashboard.css";
import DisplayCard from "../DisplayCard"
import FilterModal from "../FilterModal"


function Home() {
	const [objects, setObjects] = useState([]);
	const [filteredObjects, setFilteredObjects] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			await axios.get('http://localhost:5000/api/v1/equipments').then((response) => {
				setObjects(response.data.data || []);
				setFilteredObjects(response.data.data || [])
			}).catch((error) => {
				console.error("Error fetching equipments:", error);
			})
		}
		fetchData()
	}, []);

	const filterDefault = {
		categories: {
			cameras: false,
			labEquipment: false,
			musicalInstruments: false,
			projectMaterials: false,
			sportsKit: false
		},
		isAvailable: false
	}

	return (
		<div className='home-container'>
			<FilterModal
				objects={objects}
				setFilteredObjects={setFilteredObjects}
				defaultValues={filterDefault}
			/>
			<DisplayCard
				objects={filteredObjects}
			/>
		</div>
	)
}

export default Home