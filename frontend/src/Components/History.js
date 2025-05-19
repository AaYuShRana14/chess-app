import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./ui/Navbar";

const History = () => {
    const token = localStorage.getItem("chess-app-token");
    const navigate = useNavigate();
    if (!token) {
        window.location.href = "/signin";
    }
    const [history, setHistory] = useState([]);
    const [userid, setUserid] = useState("");

    useEffect(() => {
        axios.get("https://chess-app-opin.onrender.com/profile/me", {
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
            axios.get(`https://chess-app-opin.onrender.com/history/${userid}`)
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

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("en-GB", options).replace(",", "");
    };

    return (
        <div>
            <Navbar />
            <div className="text-white md:mt-20 mt-14 mb-10 p-5 md:p-10 rounded-xl">
                <h1 className="text-center text-4xl py-10 font-bold">Game History</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto rounded-lg shadow-md">
                        <thead className="bg-[#1C2944] text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Black</th>
                                <th className="px-4 py-3 text-left">White</th>
                                <th className="px-4 py-3 text-left">Result</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#1C2944] text-white">
                            {history.map((game, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0 ? "bg-opacity-70" : "bg-opacity-60"
                                    }`}
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{formatDateTime(game.date)}</td>
                                    <td className="px-4 py-3">{game.black.name}</td>
                                    <td className="px-4 py-3">{game.white.name}</td>
                                    <td className="px-4 py-3">
                                        {game.verdict === "draw"
                                            ? "Draw"
                                            : game.verdict === "black"
                                            ? game.black.name
                                            : game.white.name}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => navigate(`/analyse/${game._id}`)}
                                            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:scale-105 transition-transform hover:bg-indigo-500"
                                        >
                                            Analyse
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
