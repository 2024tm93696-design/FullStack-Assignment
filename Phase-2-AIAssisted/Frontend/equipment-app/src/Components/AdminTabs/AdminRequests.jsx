import { useEffect, useState } from 'react'
import "../../Assets/dashboard.css";
import PendingRequestsTable from "./AdminRequestTable"
import axios from "axios";


function MyRequests() {
	const [objects, setObjects] = useState([])
	const [errorAlert, setErrorAlert] = useState(false);
	const [error, setError] = useState("Something went wrong. Please try again later.");

	useEffect(() => {
		const fetchData = async () => {
			await axios.get('http://localhost:5000/api/v1/requests').then((response) => {
				setObjects(response.data.data.reverse() || []);
				setErrorAlert(false);
			}).catch((error) => {
				console.error("Error fetching equipments:", error);
				setError(error.response.data.message);
				setErrorAlert(true);
			})
		}
		fetchData()
	}, []);

	return (
		<div style={{ margin: "2rem" }}>
			<PendingRequestsTable objects={objects} setObjects={setObjects} />
		</div>
	)
}

export default MyRequests