import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/expenses";

function ExpenseForm({ onSubmit, initial = {}, loading, onCancel }) {
  const [category, setCategory] = useState(initial.category || "");
  const [amount, setAmount] = useState(initial.amount || "");
  const [date, setDate] = useState(initial.date ? initial.date.substring(0, 10) : "");

  useEffect(() => {
    setCategory(initial.category || "");
    setAmount(initial.amount || "");
    setDate(initial.date ? initial.date.substring(0, 10) : "");
  }, [initial]);

  return (
    <form
      className="bg-white/70 backdrop-blur p-6 rounded-xl shadow mb-6 max-w-lg w-full border border-blue-100"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ category, amount, date });
      }}
    >
      <h2 className="text-xl font-bold mb-4 text-blue-800">{initial._id ? "Edit Expense" : "Add Expense"}</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Category</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          placeholder="e.g. Food"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Amount</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          placeholder="e.g. 40"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-blue-800">Date</label>
        <input
          className="border border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-4 mt-2">
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow"
        >
          {loading ? "Saving..." : initial._id ? "Update" : "Add"}
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

export default function ExpensesSection() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      const data = await res.json();
      if (res.ok) setExpenses(data);
      else setMessage(data.message || "Could not load expenses");
    } catch {
      setMessage("Could not load expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // CREATE or UPDATE expense
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
        setMessage(editing ? "Expense updated!" : "Expense added!");
        setEditing(null);
        fetchExpenses();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch {
      setMessage("Server error");
    }
    setLoading(false);
  };

  // DELETE expense
  const handleDelete = async id => {
    if (!window.confirm("Delete this expense?")) return;
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
        setMessage("Expense deleted");
        fetchExpenses();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch {
      setMessage("Server error");
    }
    setLoading(false);
  };

  // Total summary
  const total = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  return (
    <div>
      <ExpenseForm
        onSubmit={handleSubmit}
        initial={editing || {}}
        loading={loading}
        onCancel={() => setEditing(null)}
      />
      {message && <div className="mb-4 text-center text-red-600 font-semibold">{message}</div>}
      <div className="mb-4 text-blue-900 font-bold text-lg">Total Spent: ₹{total}</div>
      <div className="overflow-x-auto rounded-2xl">
        <table className="min-w-full bg-white/90 rounded-2xl shadow-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-blue-800">Category</th>
              <th className="py-2 px-4 text-blue-800">Amount</th>
              <th className="py-2 px-4 text-blue-800">Date</th>
              <th className="py-2 px-4 text-blue-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-blue-400">
                  No expenses yet.
                </td>
              </tr>
            ) : (
              expenses.map(expense => (
                <tr key={expense._id} className="text-center border-t border-blue-100 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-4">{expense.category}</td>
                  <td className="py-2 px-4">{expense.amount}</td>
                  <td className="py-2 px-4">{expense.date?.substring(0, 10)}</td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => setEditing(expense)}
                      className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded font-semibold text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
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