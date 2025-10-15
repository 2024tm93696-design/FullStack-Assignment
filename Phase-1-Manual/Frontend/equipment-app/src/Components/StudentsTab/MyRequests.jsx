import React, { useEffect, useState } from 'react'
import RequestCard from "../RequestCard";
import "../../Assets/dashboard.css";

function MyRequests() {
	const [objects, setObjects] = useState([])
	useEffect(() => {
		const requests = localStorage.getItem('requests') ? JSON.parse(localStorage.getItem('requests')) : [];
		setObjects(requests.data);
	}, [])
	return (
		<div className='home-container'>
			<RequestCard objects={objects} showButton={false} />
		</div>
	)
}

export default MyRequests