import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./LeaderBoard.css";
const Leaderboard = () => {
    const [pageNumber, selectPage] = useState(1);
    const [users, setUsers] = useState([]);
    const { page } = useParams();
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
                console.log(fetchedUsers.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getuser();
    }, [pageNumber]);
    return (
        <div className="text-white">
            <h1 className="text-center text-4xl py-10 font-bold">Leaderboard</h1>
            <div className=" text-black rounded-2xl w-1/2 mx-auto">
                {users.map((user, index) => {
                    return (

                        <div className="flex justify-between items-center px-16 py-4 border-b-4 text-white border-slate-900 backdrop-blur-sm  rounded-2xl" key={index}>

                            <img
                                src="https://www.bing.com/th?id=OSB.eRRWJHhNKsPbYH67RxL6BA--.png&pid=MSports&w=72&h=72&qlt=90&c=0&rs=1&dpr=1&p=1"
                                alt="avatar"
                                className={`w-12 h-12 border-4 ${index === 0
                                    ? "border-yellow-400"
                                    : index === 1
                                        ? "border-slate-400"
                                        : index === 2
                                            ? "border-amber-700"
                                            : "border-transparent"
                                    }`} />
                            <h2> {user.name}</h2>

                            <h2>{user.rating}</h2>

                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
export default Leaderboard;