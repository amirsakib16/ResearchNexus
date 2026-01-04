import React, { useEffect, useState } from 'react';
import { getSubAnnouncementsByGroup } from '../services/api';
import '../styles/PlanCycle.css';

const PlanCycle = ({ groupId }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [category, setCategory] = useState('');

    const fetchAnnouncements = async () => {
        try {
            const res = await getSubAnnouncementsByGroup(groupId, category);
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Failed to load announcements', error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [category]);

    return (
        <div className="plan-cycle-container">
            <h2>🧭 Plan Cycle Announcements</h2>

            {/* FILTER */}
            <div className="filter-bar-0153">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="PREVIOUS_WEEK_UPDATE">
                        Previous Week Update
                    </option>
                    <option value="NEXT_WEEK_PLANNING">
                        Next Week Planning
                    </option>
                </select>
            </div>

            {/* LIST */}
            {announcements.length === 0 ? (
                <p className="empty-0153">No announcements found</p>
            ) : (
                announcements.map((a) => (
                    <div key={a._id} className="announcement-card-0153">
                        <span className={`badge-0153 ${a.announcement_category}`}>
                            {a.announcement_category.replace(/_/g, ' ')}
                        </span>

                        <p>{a.subannouncement}</p>

                        <small>
                            {new Date(a.createdAt).toLocaleString()}
                        </small>
                    </div>
                ))
            )}
        </div>
    );
};

export default PlanCycle;
