import { useEffect,useState} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
const Leaderboard=()=>{
    const [pageNumber,selectPage]=useState(1);
    const [users,setUsers]=useState([]);
    const {page}= useParams();
    useEffect(() => {
        if (page) {
            selectPage(Number(page)); 
        }
    }, [page]);
    useEffect(()=>{
        const getuser=async()=>{
            try{
                const fetchedUsers=await axios.get(`http://localhost:8000/leaderboard/${pageNumber}`);
                setUsers(fetchedUsers.data);
                console.log(fetchedUsers.data);
            }
            catch(err){
                console.log(err);
            }
        }
        getuser();
    },[pageNumber]);
    return(
        <div>
            <h1>Leaderboard</h1>
            {users.map((user,index)=>{
                return(
                    <div key={index}>
                        <h2>{index+1}. {user.name}</h2>
                        <h3>Rating: {user.rating}</h3>
                    </div>
                )
            }
            )}
        </div>
    )   
}
export default Leaderboard;