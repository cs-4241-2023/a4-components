import React from "react";
import "../../styles/subtask.css"
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskMode } from "../../types/dashboard.types";

interface IProps {
    mode: string
    title: string,
    setTitle: (e: string) => void,
    isComplete: boolean,
    toggleIsComplete: () => void,
    delete: () => void,
}

const SubTask: React.FC<IProps> = (props) => {
    const onSubTaskClick = () => {
        if (props.mode === TaskMode.SHOW)
            props.toggleIsComplete()
    }

    return (
        <div className="subtask" onClick={() => onSubTaskClick()}>
            {props.mode === TaskMode.SHOW ?
                <div className="subtask-title">{props.title}</div> :
                <input type="text" value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="Sub Task" />
            }
            {props.isComplete && <TaskAltIcon style={{ fill: 'green' }} />}
            {!props.isComplete && <TaskAltIcon />}
            {props.mode === TaskMode.SHOW ?
                <></> :
                <button onClick={() => props.delete()}><DeleteIcon /></button>
            }
        </div >
    )
}

export default SubTask;
