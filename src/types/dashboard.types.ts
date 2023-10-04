import { ObjectId } from "mongodb";

export const TaskMode = {
    EDIT: 'Edit',
    SHOW: 'Show',
}

export const TaskStatus = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETE: 'COMPLETE',
}

export type SubTask = {
    title: string;
    completed: boolean;
}

export type Task = {
    _id: string;
    title: string;
    details: string;
    subTasks: SubTask[];
    userId?: ObjectId;
}