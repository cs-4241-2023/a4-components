import React from "react";
import "../../styles/progress_bar.css"

interface IProps {
    progress: number
}

const ProgressBar: React.FC<IProps> = (props) => {

    return (
        <div className="progress-container">
            <div className="progress-bar-container" style={{ width: `${props.progress}%` }}>
            </div>
        </div>
    )
}

export default ProgressBar;
