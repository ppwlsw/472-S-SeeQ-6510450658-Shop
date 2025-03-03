import { useState } from "react";
import { Check, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addReminder = () => {
    if (newReminder.trim() === "") return;
    setReminders([...reminders, { text: newReminder, done: false }]);
    setNewReminder("");
  };

  const deleteReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const toggleDone = (index) => {
    setReminders(
      reminders.map((reminder, i) =>
        i === index ? { ...reminder, done: !reminder.done } : reminder
      )
    );
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(reminders[index].text);
  };

  const saveEdit = (index) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].text = editedText;
    setReminders(updatedReminders);
    setEditingIndex(null);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          placeholder="Add a new reminder..."
        />
        <Button onClick={addReminder} className="bg-blue-500">
          <Plus size={18} />
        </Button>
      </div>
      <ul>
        {reminders.map((reminder, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded-md"
          >
            {editingIndex === index ? (
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoFocus
              />
            ) : (
              <span
                className={reminder.done ? "line-through text-gray-500" : ""}
              >
                {reminder.text}
              </span>
            )}
            <div className="flex gap-2">
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
