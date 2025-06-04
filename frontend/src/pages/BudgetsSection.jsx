import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/budgets";

function BudgetForm({ onSubmit, initial = {}, loading, onCancel }) {
  const [category, setCategory] = useState(initial.category || "");
  const [limit, setLimit] = useState(initial.limit || "");
  const [month, setMonth] = useState(initial.month || "");

  useEffect(() => {
    setCategory(initial.category || "");
    setLimit(initial.limit || "");
    setMonth(initial.month || "");
  }, [initial]);

  return (
    <form
      className="bg-white/70 backdrop-blur p-6 rounded-xl shadow mb-6 max-w-lg w-full border border-blue-100"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ category, limit, month });
      }}
    >
      <h2 className="text-xl font-bold mb-4 text-blue-800">{initial._id ? "Edit Budget" : "Create Budget"}</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Category</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          placeholder="e.g. Groceries"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Limit</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="number"
          min="1"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          required
          placeholder="e.g. 250"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Month (YYYY-MM)</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-4 mt-2">
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow"
        >
          {loading ? "Saving..." : initial._id ? "Update" : "Create"}
        </button>
        {initial._id && (
          <button
            type="button"
            className="text-blue-700 underline"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function BudgetsSection() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const fetchBudgets = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(API_BASE, {
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      const data = await res.json();
      if (res.ok) setBudgets(data);
      else setMessage(data.message || "Could not load budgets");
    } catch {
      setMessage("Could not load budgets");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // CREATE or UPDATE budget
  const handleSubmit = async form => {
    setLoading(true);
    setMessage("");
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_BASE}/${editing._id}` : `${API_BASE}/create`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(editing ? "Budget updated!" : "Budget created!");
        setEditing(null);
        fetchBudgets();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch {
      setMessage("Server error");
    }
    setLoading(false);
  };

  // DELETE budget
  const handleDelete = async id => {
    if (!window.confirm("Delete this budget?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Budget deleted");
        fetchBudgets();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch {
      setMessage("Server error");
    }
    setLoading(false);
  };

  return (
    <div>
      <BudgetForm
        onSubmit={handleSubmit}
        initial={editing || {}}
        loading={loading}
        onCancel={() => setEditing(null)}
      />
      {message && <div className="mb-4 text-center text-red-600 font-semibold">{message}</div>}
      <div className="overflow-x-auto rounded-2xl">
        <table className="min-w-full bg-white/90 rounded-2xl shadow-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-blue-800">Category</th>
              <th className="py-2 px-4 text-blue-800">Limit</th>
              <th className="py-2 px-4 text-blue-800">Month</th>
              <th className="py-2 px-4 text-blue-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-blue-400">
                  No budgets yet.
                </td>
              </tr>
            ) : (
              budgets.map(budget => (
                <tr key={budget._id} className="text-center border-t border-blue-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-4">{budget.category}</td>
                  <td className="py-2 px-4">{budget.limit}</td>
                  <td className="py-2 px-4">{budget.month}</td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => setEditing(budget)}
                      className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded font-semibold text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-semibold text-white transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}