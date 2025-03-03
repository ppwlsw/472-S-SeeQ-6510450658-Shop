import { useState } from "react";
import { Check, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";



interface Reminder {
  title: string;
  description: string;
  due_date: string;
  status: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  const addReminder = () => {
    if (newTitle.trim() === "" || newDueDate.trim() === "") return;
    setReminders([
      ...reminders,
      {
        title: newTitle,
        description: newDescription,
        due_date: newDueDate,
        status: false,
      },
    ]);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  const deleteReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const toggleDone = (index: number) => {
    setReminders(
      reminders.map((reminder, i) =>
        i === index ? { ...reminder, status: !reminder.status } : reminder
      )
    );
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedTitle(reminders[index].title);
    setEditedDescription(reminders[index].description);
    setEditedDueDate(reminders[index].due_date);
  };

  const saveEdit = (index: number) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].title = editedTitle;
    updatedReminders[index].description = editedDescription;
    updatedReminders[index].due_date = editedDueDate;
    setReminders(updatedReminders);
    setEditingIndex(null);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <div className="flex flex-col gap-2 mb-4">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
        />
        <Input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description"
        />
        <Input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <Button onClick={addReminder} className="bg-blue-500">
          <Plus size={18} />
        </Button>
      </div>
      <ul>
        {reminders.map((reminder, index) => (
          <li className="flex flex-col bg-gray-100 p-2 mb-2 rounded-md">
            {editingIndex === index ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                />
                <Input
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <Input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <p className="font-bold">{reminder.title}</p>
                <p className="text-sm text-gray-600">{reminder.description}</p>
                <p className="text-sm text-gray-600">
                  Due: {reminder.due_date}
                </p>
                <p
                  className={
                    reminder.status ? "text-green-600" : "text-red-600"
                  }
                >
                  {reminder.status ? "Completed" : "Pending"}
                </p>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              {editingIndex === index ? (
                <Button size="sm" onClick={() => saveEdit(index)}>
                  Save
                </Button>
              ) : (
                <>
                  <Button size="icon" onClick={() => toggleDone(index)}>
                    <Check size={18} />
                  </Button>
                  <Button size="icon" onClick={() => startEditing(index)}>
                    <Edit size={18} />
                  </Button>
                  <Button size="icon" onClick={() => deleteReminder(index)}>
                    <Trash2 size={18} />
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
