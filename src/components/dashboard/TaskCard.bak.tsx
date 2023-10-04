import React, { useState } from 'react';
import { Priority, PriorityColor } from '../../types/dashboard.types';
import { ArrowDownward, Remove, ArrowUpward } from '@mui/icons-material';  // Corrected icon imports

import "../../styles/task_card.css"

const TaskCard: React.FC = () => {
    const [mode, setMode] = useState('edit');
    const [priority, setPriority] = useState(Priority.MEDIUM);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [dueDate, setDueDate] = useState('');

    const priorityColor = PriorityColor[priority];
    const priorityIcons = {
        [Priority.LOW]: <ArrowDownward style={{ color: priorityColor }} />,
        [Priority.MEDIUM]: <Remove style={{ color: priorityColor }} />,
        [Priority.HIGH]: <ArrowUpward style={{ color: priorityColor }} />,
    };

    return (
        <div className={`task-card ${mode}`}>
            <div className="header">
                {mode === 'show' ? <h2>{title}</h2> : <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />}
                {mode === 'show' ? <h3>{category}</h3> : <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Category' />}
                <div className="priority-group">
                    {priorityIcons[priority]}
                    {mode === 'edit' && (
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            {Object.values(Priority).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            <div className="Description">
                <label>Description</label>
                {mode === 'show' ? <div>{description}</div> : <textarea value={description} onChange={(e) => setDescription(e.target.value)} />}
            </div>
            <div className="footer">
                {mode === 'show' && (
                    <div className="info">
                        <span>Created By: {createdBy}</span>
                        <span>Assigned To: {assignedTo}</span>
                        <span>Due: {dueDate}</span>
                    </div>
                )}
                {mode === 'edit' && (
                    <div className="edit-info">
                        <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} placeholder="Created By" />
                        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assigned To" />
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                )}
            </div>
            <button onClick={() => setMode(mode === 'show' ? 'edit' : 'show')}>{mode === 'show' ? 'Edit' : 'Save'}</button>
        </div>
    );
};

export default TaskCard;
