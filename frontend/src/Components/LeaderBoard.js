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
        console.log(pageNumber);
        const getuser = async () => {
            try {
                const fetchedUsers = await axios.get(`http://localhost:8000/leaderboard/${pageNumber}`);
                setUsers(fetchedUsers.data);

            }
            catch (err) {
                console.log(err);
            }
        }
        getuser();
    }, [pageNumber]);
    return (<><Navbar />
        <div className="text-white mt-10">
            <h1 className="text-center text-4xl py-10 font-bold">Leaderboard</h1>
            <div className="bg-[#203159] rounded-2xl w-1/2 mx-auto ">
                {users.map((user, index) => {
                    return (
                        <div className="flex justify-between items-center px-16 py-4 border-b-4 text-white border-slate-900 backdrop-blur-sm  rounded-2xl text-xl" key={index}> <img src="https://th.bing.com/th/id/OIP.GsccDimuLuLO4P2dv5SyWQHaNK?rs=1&pid=ImgDetMain"
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
                            <h2> {user.name}</h2>

                            <h2>{user.rating}</h2>

                        </div>
                    )
                }
                )}
            </div>
        </div>
    </>
    )
}
export default Leaderboard;
