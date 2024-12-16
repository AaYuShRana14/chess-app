import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Navbar from "./ui/Navbar";
const History = () => {
    const token = localStorage.getItem("chess-app-token");
    const navigate=useNavigate();
    if (!token) {
        window.location.href = "/signin";
    }
    const [history, setHistory] = useState([]);
    const [userid, setUserid] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/profile/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            const data = response.data;
            if (data) {
                setUserid(data._id); 
            }
        }).catch((error) => {
            console.error("Error fetching profile:", error);
        });
    }, [token]);
    useEffect(() => {
        if (userid) { 
            axios.get(`http://localhost:8000/history/${userid}`)
                .then((response) => {
                    const data = response.data;
                    if (data) {
                        setHistory(data);
                    }
                }).catch((error) => {
                    console.error("Error fetching history:", error);
                });
        }
    }, [userid]);

    return (
        <div>
            <Navbar/>
           <div className="text-white mt-14 mb-10 mx-10">
                <h1 className="text-center text-4xl py-10 font-bold w-1/2 mx-auto">History</h1>
            {history.map((game, index) => {
                return (
                    <div key={index} onClick={()=>{navigate(`/analyse/${game._id}`)}}>
                        <h3>Game {index + 1}</h3>
                        <p>Black: {game.black.name}</p>
                        <p>White:{game.white.name}</p>
                        {game.verdict === "draw" ? (
                            <p>Result: Draw</p>
                        ) : game.verdict === "black" ? (
                            <p>Winner:{game.black.name}</p>
                        ) : (
                            <p>Winner:{game.white.name}</p>
                        )}
                       <hr></hr>
                    </div>
                );
            })}
            </div>
        </div>
    );
};

export default History;
