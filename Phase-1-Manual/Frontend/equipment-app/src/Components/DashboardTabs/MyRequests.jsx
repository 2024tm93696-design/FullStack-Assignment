import { useEffect, useState } from 'react'
import RequestCard from "../RequestCard";
import "../../Assets/dashboard.css";
import FilterModal from "../FilterModal"

function MyRequests() {
	const [objects, setObjects] = useState([])
	const [filteredObjects, setFilteredObjects] = useState([])

	useEffect(() => {
		const requests = localStorage.getItem('requests') ? JSON.parse(localStorage.getItem('requests')) : [];
		setFilteredObjects(requests.data)
		setObjects(requests.data);
	}, [])

	const filterDefault = {
		categories: {
			approved: false,
			pending: false,
			returned: false,
			rejected: false,
		},
	}
	return (
		<div className='home-container'>
			<FilterModal
				objects={objects}
				setFilteredObjects={setFilteredObjects}
				defaultValues={filterDefault}
				request={true}
			/>
			<RequestCard objects={filteredObjects} showButton={false} />
		</div>
	)
}

export default MyRequests