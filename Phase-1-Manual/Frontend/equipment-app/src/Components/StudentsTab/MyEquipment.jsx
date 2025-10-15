import React, { useEffect, useState } from 'react'
import RequestCard from "../RequestCard";
import "../../Assets/dashboard.css";

function MyEquipment() {
    const [objects, setObjects] = useState([])
    useEffect(()=>{
       const requests = localStorage.getItem('requests') ? JSON.parse(localStorage.getItem('requests')) : [];
       const myEquipments = requests.data.filter(item => item.status === "APPROVED");
       setObjects(myEquipments);
    }, [])
  return (
    <div className='home-container'>
        <RequestCard objects={objects} showButton={true}/>
    </div>
  )
}

export default MyEquipment