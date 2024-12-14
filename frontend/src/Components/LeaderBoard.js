import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
    const { page } = useParams();
    const [pageNumber, setPageNumber] = useState(Number(page) || 1); 
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/leaderboard/${pageNumber}`);
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [pageNumber]);

    useEffect(() => {
        if (page) {
            setPageNumber(Number(page));
        }
    }, [page]);

    return (
        <div>
            <h1>Leaderboard</h1>
            {users.map((user, index) => (
                <div key={index}>
                    <h2>
                        {index + 1}. {user.name}
                    </h2>
                    <h3>Rating: {user.rating}</h3>
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;
