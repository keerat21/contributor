import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./GoalPage.scss";
import { SDGs } from "../../assets/goalsData";
import backIcon from "/images/other/backIcon.png"

import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GoalPage = () => {
    const { goalId } = useParams();
    const goal = SDGs.find((item) => Number(goalId) === item.id);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState("");
    const [expandedTarget, setExpandedTarget] = useState(null);
    const [userActions, setUserActions] = useState({});
    const [newAction, setNewAction] = useState("");
    const [activeTab, setActiveTab] = useState("discussion");
    const [progressNews, setProgressNews] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const navigator = useNavigate();

    useEffect(() => {
        // Fetch existing progress news from API
        // Fetch chart data from API (mock example below)
        axios.get(`http://localhost:5000/api/goals/${goalId}`)
            .then(response => {
                setPosts(response.data.posts || []);
                setResources(response.data.resources || []);
                setProgressNews(response.data.progressNews || []);

            })
            .catch(error => console.error("Error fetching goal data:", error));
        setChartData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Number of Visits",
                    data: [10, 20, 30, 25, 35, 50, 45, 55, 60, 70, 75, 80],
                    borderColor: "#1976d2",
                    tension: 0.4,
                },
                {
                    label: "Posts Per Month",
                    data: [5, 10, 15, 12, 18, 25, 22, 28, 30, 40, 42, 45],
                    borderColor: "#43a047",
                    tension: 0.4,
                }
            ]
        });
    }, [goalId]);


    const handleActionSubmit = (targetId) => {
        if (newAction.trim()) {
            axios.post(`http://localhost:5000/api/goals/${goalId}/actions`, { text: newAction })
                .then(response => {
                    setUserActions(prevActions => ({
                        ...prevActions,
                        [targetId]: response.data.actions || []
                    }));
                    setNewAction("");
                })
                .catch(error => console.error("Error submitting action:", error));
        }
    };


    const handleVote = (targetId, type) => {
        setTargetVotes(prevVotes => ({
            ...prevVotes,
            [targetId]: prevVotes[targetId] ? prevVotes[targetId] + (type === "up" ? 1 : -1) : type === "up" ? 1 : -1
        }));
    };

    const handlePostSubmit = () => {
        if (newPost.trim()) {
            axios.post(`http://localhost:5000/api/goals/${goalId}/posts`, { text: newPost, author: "Anonymous" })
                .then(response => {
                    setPosts(response.data.posts);
                    setNewPost("");
                });
        }
    };



    const handleResourceSubmit = () => {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (newResource.trim() && urlPattern.test(newResource)) {
            axios.post(`http://localhost:5000/api/goals/${goalId}/resources`, { url: newResource })
                .then(response => {
                    setResources(response.data.resources);
                    setNewResource("");
                });
        } else {
            alert("Please enter a valid URL.");
        }
    };

    return (
        <div className="goal-page">
            <span className="goal-page__header">
                <img src={backIcon} alt="Back icon" className="back-icon" onClick={() => { navigator(-1); }} />
                <h1>{goal ? goal.name : "Goal Not Found"}</h1>
            </span>

            <p>{goal?.description}</p>
            {/* Progress News Section */}
            <div className="goal-page__layout">
                <div className="goal-page__progress">
                    <h2>Progress News</h2>
                    <Line data={chartData} />
                    <ul>
                        {progressNews.map((news, index) => (
                            <li key={index} className="goal-page__news-item">{news}</li>
                        ))}
                    </ul>
                </div>
                <div className="goal-page__aside">
                    <div className="goal-page__tabs">
                        <button className={activeTab === "discussion" ? "active" : ""} onClick={() => setActiveTab("discussion")}>Public Discussions</button>
                        <button className={activeTab === "resources" ? "active" : ""} onClick={() => setActiveTab("resources")}>Educational Resources</button>
                    </div>

                    <div className="goal-page__content">
                        {activeTab === "discussion" && (
                            <div className="goal-page__discussion">
                                <h2>Public Discussions</h2>
                                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share your thoughts..." />
                                <button onClick={handlePostSubmit}>Post</button>
                                <ul>
                                    {posts.map((post) => (
                                        <li key={post.id} className="goal-page__post">
                                            <p>{post.text}</p>
                                            <span>- {post.author}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "resources" && (
                            <div className="goal-page__resources">
                                <h2>Educational Resources</h2>
                                <input
                                    value={newResource}
                                    onChange={(e) => setNewResource(e.target.value)}
                                    placeholder="Share a valid learning resource URL..."
                                />
                                <button onClick={handleResourceSubmit}>Share</button>
                                <ul>
                                    {resources.map((resource) => <li key={resource.id}><a href={"https://" + resource.name} target="_blank" rel="noopener noreferrer">{resource.name}</a></li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Targets Section */}
                    <div className="goal-page__targets">
                        <h2>SDG Targets</h2>
                        {goal?.targets?.map(target => (
                            <div key={target.id} className="goal-page__target">
                                <button onClick={() => setExpandedTarget(expandedTarget === target.id ? null : target.id)}>
                                    {target.id} {expandedTarget === target.id ? "▲" : "▼"}
                                </button>
                                <p>{target.text}</p>
                                {expandedTarget === target.id && (
                                    <>

                                        <div className="goal-page__actions">
                                            <h4>Actions Taken by Users</h4>
                                            <ul>
                                                {userActions[target.id]?.map((action, index) => (
                                                    <li key={index}>{action}</li>
                                                ))}
                                            </ul>
                                            <input
                                                type="text"
                                                value={newAction}
                                                onChange={(e) => setNewAction(e.target.value)}
                                                placeholder="Describe an action you're taking..."
                                            />
                                            <button onClick={() => handleActionSubmit(target.id)}>Submit</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalPage;
