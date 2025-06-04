import { useState } from "react";

export default function Profile({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [editing, setEditing] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
    setEditing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-lg"
          onClick={onClose}
        >✕</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-blue-800 mb-1">Name</label>
            <input
              className="w-full border border-blue-200 rounded px-3 py-2"
              name="name"
              disabled={!editing}
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold text-blue-800 mb-1">Email</label>
            <input
              className="w-full border border-blue-200 rounded px-3 py-2"
              name="email"
              type="email"
              disabled={!editing}
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-4 mt-4">
            {!editing ? (
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded font-semibold"
              >
                Save
              </button>
            )}
            <button
              type="button"
              className="bg-gray-200 px-6 py-2 rounded font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}