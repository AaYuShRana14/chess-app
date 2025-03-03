import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LeaderBoard.css";
import Navbar from "./ui/Navbar";

const Leaderboard = () => {
    const { page } = useParams();
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(Number(page) || 1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (page) {
            setPageNumber(Number(page));
        }
    }, [page]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const fetchedUsers = await axios.get(`http://localhost:8000/leaderboard/${pageNumber}`);
                setUsers(fetchedUsers.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [pageNumber]);

    // Close menu when navigating
    useEffect(() => {
        if (menuOpen) {
            setMenuOpen(false);
        }
    }, [pageNumber]);

    const handleNextPage = () => {
        const nextPage = pageNumber + 1;
        setPageNumber(nextPage);
        navigate(`/leaderboard/${nextPage}`);
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            const prevPage = pageNumber - 1;
            setPageNumber(prevPage);
            navigate(`/leaderboard/${prevPage}`);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <header className="mobile-header">
                <div className="mobile-logo">Leaderboard</div>
                <div className="hamburger-container">
                    <button 
                        className={`hamburger-button ${menuOpen ? 'active' : ''}`} 
                        onClick={toggleMenu}
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </div>
            </header>

            {/* Menu Overlay */}
            <div 
                className={`menu-overlay ${menuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
            ></div>
            
            {/* Mobile Navigation Menu */}
            <nav className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-items">
                    <a href="/leaderboard/1" className="mobile-menu-item active">Leaderboard</a>
                    <a href="/profile" className="mobile-menu-item">Profile</a>
                    <a href="/matches" className="mobile-menu-item">Matches</a>
                    <a href="/statistics" className="mobile-menu-item">Statistics</a>
                    <a href="/settings" className="mobile-menu-item">Settings</a>
                </div>
            </nav>

            {/* Regular Navbar for Desktop */}
            <Navbar />
            
            <div className="leaderboard-container">
                <h1 className="leaderboard-title">Leaderboard</h1>
                <div className="leaderboard-board">
                    {/* Column Headings */}
                    <div className="leaderboard-headers">
                        <div>Rank</div>
                        <div>Handle Name</div>
                        <div className="matches-column">Matches</div>
                        <div className="wins-column">Wins</div>
                        <div style={{ textAlign: 'right' }}>Rating</div>
                    </div>

                    {/* User List */}
                    <div className="space-y-4">
                        {loading ? (
                            // Loading skeletons
                            Array(10).fill().map((_, index) => (
                                <div key={index} className="leaderboard-user loading-skeleton">
                                    <div className="rank-container">
                                        <div className="leaderboard-rank">&nbsp;</div>
                                        <div className="user-avatar" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                                    </div>
                                    <div className="user-name">&nbsp;</div>
                                    <div className="matches-column">&nbsp;</div>
                                    <div className="wins-column">&nbsp;</div>
                                    <div className="user-rating">&nbsp;</div>
                                </div>
                            ))
                        ) : (
                            users.map((user, index) => {
                                // Calculate the absolute rank
                                const absoluteRank = (pageNumber - 1) * 10 + index + 1;
                                
                                // Determine rank class based on position
                                let rankClass = '';
                                if (pageNumber === 1) {
                                    if (index === 0) rankClass = 'rank-1';
                                    else if (index === 1) rankClass = 'rank-2';
                                    else if (index === 2) rankClass = 'rank-3';
                                    else rankClass = 'rank-top-10';
                                } else if (absoluteRank <= 10) {
                                    rankClass = 'rank-top-10';
                                } else {
                                    rankClass = 'rank-regular';
                                }
                                
                                return (
                                    <div key={index} className="leaderboard-user">
                                        {/* Rank */}
                                        <div className="rank-container">
                                            <div className={`leaderboard-rank ${rankClass}`}>
                                                {absoluteRank}
                                            </div>
                                            <img
                                                src="https://th.bing.com/th/id/OIP.G1GZrTRxxTmalTuvu5VYGQHaHa?rs=1&pid=ImgDetMain"
                                                alt="avatar"
                                                className="user-avatar"
                                            />
                                        </div>

                                        {/* Handle Name */}
                                        <div className="user-name">
                                            {user.name}
                                        </div>
                                        <div className="matches-column">
                                            {user.totalMatches}
                                        </div>
                                        <div className="wins-column">
                                            {user.totalWins}
                                        </div>
                                        <div className="user-rating">
                                            {user.rating}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                        className="pagination-button prev-button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button
                        onClick={handleNextPage}
                        className="pagination-button next-button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;