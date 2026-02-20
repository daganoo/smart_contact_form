import { useState, useEffect } from "react";
import axios from "axios";
import emailIcon from "../assets/email_icon.png";

const AdminDashboard = ({ onBack }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL.replace("/contact", "")}/submissions`,
            );
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1>
                        <img
                            src={emailIcon}
                            alt="Smart Contact Form"
                            style={{ marginRight: "10px", height: "65px" }}
                        />{" "}
                        Admin Dashboard
                    </h1>
                    <p>{submissions.length} total submissions</p>
                </div>
                <div className="admin-header-actions">
                    <button className="btn-refresh" onClick={fetchSubmissions}>
                        🔄 Refresh
                    </button>
                    <button className="btn-back" onClick={onBack}>
                        ← Back to Form
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Loading submissions...</div>
            ) : submissions.length === 0 ? (
                <div className="admin-empty">No submissions yet.</div>
            ) : (
                <div className="admin-layout">
                    <div className="admin-list">
                        {submissions.map((s) => (
                            <div
                                key={s.id}
                                className={`admin-card ${selected?.id === s.id ? "active" : ""}`}
                                onClick={() => setSelected(s)}
                            >
                                <div className="admin-card-name">{s.name}</div>
                                <div className="admin-card-subject">
                                    {s.subject}
                                </div>
                                <div className="admin-card-date">
                                    {formatDate(s.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-detail">
                        {selected ? (
                            <>
                                <div className="detail-row">
                                    <span className="detail-label">Name</span>
                                    <span>{selected.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span>{selected.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">
                                        Subject
                                    </span>
                                    <span>{selected.subject}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date</span>
                                    <span>
                                        {formatDate(selected.timestamp)}
                                    </span>
                                </div>
                                <div className="detail-message">
                                    <span className="detail-label">
                                        Message
                                    </span>
                                    <p>{selected.message}</p>
                                </div>
                            </>
                        ) : (
                            <div className="admin-empty">
                                Select a submission to view details
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
