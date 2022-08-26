import { IncomingTask, TaskModel } from "../types";

export const toTaskModel = (task: IncomingTask): TaskModel => {
  // console.log(task)
  const duedate = task && task.due ? task?.due?.datetime : null
  const due_date: Date | undefined = duedate? new Date (duedate) : undefined;
  const current_date: Date = new Date();
  const is_overdue = due_date ? (current_date < due_date ? false : true) : false
  const recurring = task && task.due ? task.due?.recurring : false;
  const created: Date = new Date(task.created)

  return {
    id: task.id,
    content: task.content,
    is_overdue: is_overdue,
    due_date: due_date,
    create_date: created,
    recurring: recurring,
  };

}
