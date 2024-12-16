import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./LeaderBoard.css";
import Navbar from "./ui/Navbar";

const Leaderboard = () => {
    const { page } = useParams();
    const [pageNumber, selectPage] = useState(Number(page) || 1);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (page) {
            selectPage(Number(page));
        }
    }, [page]);

    useEffect(() => {
        const getuser = async () => {
            try {
                const fetchedUsers = await axios.get(`http://localhost:8000/leaderboard/${pageNumber}`);
                setUsers(fetchedUsers.data);
            } catch (err) {
                console.log(err);
            }
        };
        getuser();
    }, [pageNumber]);

    const handleNextPage = () => {
        selectPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            selectPage(prevPage => prevPage - 1);
        }
    };

    return (
        <>
            <Navbar />
            <div className="text-white mt-14 mb-10">
                <h1 className="text-center text-4xl py-10 font-bold w-1/2 mx-auto">Leaderboard</h1>

                <div className="bg-[#1b2a47] rounded-2xl w-1/2 mx-auto">
                    {/* Table Headers */}
                    <div className="flex justify-between items-center px-20 py-4 bg-[#1b2a47] text-white text-xl font-bold rounded-t-2xl border-b-4 border-slate-900">
                        <span>Rank</span>
                        <span>Handle Name</span>
                        <span>Rating</span>
                    </div>

                    {/* Table Rows */}
                    {users.map((user, index) => (
                        <div
                            className="flex justify-between items-center px-16 py-4 border-b-4 text-white border-slate-900 backdrop-blur-sm rounded-2xl text-xl"
                            key={index}
                        >
                            <h2 className="flex gap-4">
                                {(pageNumber - 1) * 10 + index + 1}
                                <img
                                    src="https://th.bing.com/th/id/OIP.G1GZrTRxxTmalTuvu5VYGQHaHa?rs=1&pid=ImgDetMain"
                                    alt="avatar"
                                    className={`w-12 h-12 border-4 rounded ${pageNumber === 1
                                            ? index === 0
                                                ? "border-yellow-400"
                                                : index === 1
                                                    ? "border-slate-400"
                                                    : index === 2
                                                        ? "border-amber-700"
                                                        : "border-transparent"
                                            : "border-transparent"
                                        }`}
                                />
                            </h2>
                            <h2>{user.name}</h2>
                            <h2>{user.rating}</h2>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center px-10 py-4 bg-[#1b2a47] text-white text-lg font-bold rounded-b-2xl">
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNumber === 1}
                            className={`text-2xl px-4 align- rounded ${pageNumber === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"}`}
                        >
                            ←
                        </button>
                      
                        <button
                            onClick={handleNextPage}
                            className="text-2xl px-4 rounded bg-slate-900 hover:bg-slate-800"
                        >
                            →
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Leaderboard;
