import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        selectPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            selectPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <>
            <Navbar />
            <div className="text-white md:mt-20 mt-14 mb-10 bg-gradient-to-r from-indigo-500 to-purple-500 p-5 md:p-10 rounded-xl">
                <h1 className="text-center text-3xl md:text-4xl py-6 font-bold">Leaderboard</h1>
                <div className="bg-white px-5 md:px-16 py-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 ">
                    {/* Column Headings */}
                    <div className="grid md:grid-cols-5 grid-cols-3 font-bold text-gray-700 text-base md:text-lg border-b pb-2 mx-2 md:mx-4 mb-6 ">
                        <div className="flex items-center">Rank</div>
                        <div className="flex items-center">Handle Name</div>
                        <div className="hidden md:flex items-center">Matches</div>
                        <div className="hidden md:flex items-center">Wins</div>
                        <div className="flex items-center justify-end">Rating</div>
                    </div>

                    {/* User List */}
                    <div className="space-y-4">
                        {users.map((user, index) => (
                            <div
                                key={index}
                                className="grid md:grid-cols-5 grid-cols-3 items-center bg-gray-100 p-4 md:p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg bg-opacity-40"
                            >
                                {/* Rank */}
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`leaderboard-rank w-12 h-12 flex items-center justify-center ${pageNumber === 1 && index < 3
                                            ? index === 0
                                                ? "bg-yellow-400 border-b-4 border-yellow-600"
                                                : index === 1
                                                    ? "bg-slate-400 border-b-4 border-slate-600"
                                                    : "bg-amber-600 border-b-4 border-amber-800"
                                            : "bg-gray-400 text-gray-800"
                                            } font-bold text-white rounded-full`}
                                    >
                                        {(pageNumber - 1) * 10 + index + 1}
                                    </div>
                                    <img
                                        src="https://th.bing.com/th/id/OIP.G1GZrTRxxTmalTuvu5VYGQHaHa?rs=1&pid=ImgDetMain"
                                        alt="avatar"
                                        className="w-12 h-12 rounded"
                                    />
                                </div>

                                {/* Handle Name */}
                                <div className="text-base md:text-lg font-semibold text-gray-600">
                                    {user.name}
                                </div>
                                <div className="hidden md:block text-lg font-semibold text-gray-600">
                                    {user.totalMatches}
                                </div>
                                <div className="hidden md:block text-lg font-semibold text-gray-600">
                                    {user.totalWins}
                                </div>
                                <div className="text-base md:text-lg font-semibold text-gray-600 text-right">
                                    {user.rating}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="p-5">
                    <div className="flex justify-center items-baseline flex-wrap">
                        <div className="flex m-2">
                            <button
                                onClick={handlePrevPage}
                                className="text-base rounded-r-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                hover:bg-gray-200 bg-gray-100 text-indigo-700 border duration-200 ease-in-out border-indigo-600 transition"
                            >
                                <div className="flex leading-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-chevron-left w-5 h-5"
                                    >
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>

                                </div>
                            </button>
                            <button
                                onClick={handleNextPage}
                                className="text-base rounded-l-none border-l-0 hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                                hover:bg-gray-200 bg-gray-100 text-indigo-700 border duration-200 ease-in-out border-indigo-600 transition"
                            >
                                <div className="flex leading-5">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-chevron-right w-5 h-5 ml-1"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
