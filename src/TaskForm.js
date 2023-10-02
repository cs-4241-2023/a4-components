import React, { useRef } from 'react';

function TaskForm({ onSubmit }) {
    const taskRef = useRef(null);
    const hoursRef = useRef(null);
    const dueDateRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            task: taskRef.current.value,
            hours: hoursRef.current.value,
            dueDate: dueDateRef.current.value
        });
    };

    return (
        <section>
            <form style={{ marginBottom: '100px' }} onSubmit={handleSubmit}>
                {/* ... Remaining form fields using ref */}
                <button type="submit">Submit</button>
            </form>
        </section>
    );
}

export default TaskForm;
