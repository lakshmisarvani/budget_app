// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Use blue/white color scheme
// const PRIMARY_BG = "bg-blue-700";
// const PRIMARY_BG_LIGHT = "bg-blue-100";
// const ACCENT = "bg-blue-500";
// const ACCENT_HOVER = "hover:bg-blue-600";
// const BTN_DELETE = "bg-red-500 hover:bg-red-600";

// const API_BASE = 'http://localhost:5000/api/budgets';

// function Navbar({ onLogout }) {
//   return (
//     <nav className={`w-full flex items-center justify-between ${PRIMARY_BG} text-white px-6 py-4 rounded-2xl shadow-lg mb-8`}>
//       <div className="font-black text-2xl tracking-wide flex items-center gap-2">
//         <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.1"/>
//           <path d="M7 14s1.5 2 5 2 5-2 5-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
//           <circle cx="9" cy="10" r="1" fill="#fff"/>
//           <circle cx="15" cy="10" r="1" fill="#fff"/>
//         </svg>
//         Budget Dashboard
//       </div>
//       <div className="flex gap-6 font-medium">
//         <a href="#create" className="hover:underline">Create Budget</a>
//         <a href="#view" className="hover:underline">View Budgets</a>
//       </div>
//       <button onClick={onLogout} className={`${BTN_DELETE} px-5 py-2 rounded-xl font-semibold transition-all`}>
//         Logout
//       </button>
//     </nav>
//   );
// }

// function BudgetForm({ onSubmit, initial = {}, loading }) {
//   const [category, setCategory] = useState(initial.category || '');
//   const [limit, setLimit] = useState(initial.limit || '');
//   const [month, setMonth] = useState(initial.month || '');

//   useEffect(() => {
//     setCategory(initial.category || '');
//     setLimit(initial.limit || '');
//     setMonth(initial.month || '');
//   }, [initial]);

//   return (
//     <form
//       className="bg-white/70 backdrop-blur p-8 rounded-2xl shadow-xl mb-8 max-w-lg w-full border border-blue-100"
//       onSubmit={e => {
//         e.preventDefault();
//         onSubmit({ category, limit, month });
//       }}
//     >
//       <h2 className="text-2xl font-bold mb-6 text-blue-800">{initial._id ? 'Edit Budget' : 'Create Budget'}</h2>
//       <div className="mb-4">
//         <label className="block font-semibold mb-1 text-blue-800">Category</label>
//         <input
//           className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
//           type="text"
//           value={category}
//           onChange={e => setCategory(e.target.value)}
//           required
//           placeholder="e.g. Groceries"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block font-semibold mb-1 text-blue-800">Limit</label>
//         <input
//           className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
//           type="number"
//           min="1"
//           value={limit}
//           onChange={e => setLimit(e.target.value)}
//           required
//           placeholder="e.g. 250"
//         />
//       </div>
//       <div className="mb-6">
//         <label className="block font-semibold mb-1 text-blue-800">Month (YYYY-MM)</label>
//         <input
//           className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
//           type="month"
//           value={month}
//           onChange={e => setMonth(e.target.value)}
//           required
//         />
//       </div>
//       <button
//         disabled={loading}
//         type="submit"
//         className={`${ACCENT} ${ACCENT_HOVER} text-white px-7 py-2 rounded-xl font-semibold shadow transition-all`}
//       >
//         {loading ? 'Saving...' : (initial._id ? 'Update' : 'Create')}
//       </button>
//       {initial._id && (
//         <button
//           type="button"
//           className="ml-6 text-blue-700 underline"
//           onClick={() => onSubmit({ cancel: true })}
//         >
//           Cancel
//         </button>
//       )}
//     </form>
//   );
// }

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) setUser(JSON.parse(storedUser));
//     else navigate('/login');
//   }, [navigate]);

//   const fetchBudgets = async () => {
//     setLoading(true);
//     setMessage('');
//     try {
//       const res = await fetch(API_BASE, {
//         headers: {
//           Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//       });
//       const data = await res.json();
//       if (res.ok) setBudgets(data);
//       else setMessage(data.message || 'Could not load budgets');
//     } catch (e) {
//       setMessage('Could not load budgets');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (user) fetchBudgets();
//     // eslint-disable-next-line
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const handleSubmit = async (form) => {
//     if (form.cancel) {
//       setEditing(null);
//       return;
//     }
//     setLoading(true);
//     setMessage('');
//     try {
//       const method = editing ? 'PUT' : 'POST';
//       const url = editing ? `${API_BASE}/${editing._id}` : `${API_BASE}/create`;
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage(editing ? 'Budget updated!' : 'Budget created!');
//         setEditing(null);
//         fetchBudgets();
//       } else {
//         setMessage(data.message || 'Error occurred');
//       }
//     } catch (e) {
//       setMessage('Server error');
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this budget?')) return;
//     setLoading(true);
//     setMessage('');
//     try {
//       const res = await fetch(`${API_BASE}/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage('Budget deleted');
//         fetchBudgets();
//       } else {
//         setMessage(data.message || 'Error occurred');
//       }
//     } catch (e) {
//       setMessage('Server error');
//     }
//     setLoading(false);
//   };

//   if (!user) return null;

//   return (
//     <div className={`${PRIMARY_BG_LIGHT} min-h-screen flex flex-col items-center py-8 px-2 transition-colors`}>
//       <Navbar onLogout={handleLogout} />
//       <div className="max-w-2xl w-full">
//         <h1 className="text-3xl font-extrabold text-blue-800 mb-2">Welcome, {user.name}!</h1>
//         <p className="text-blue-700 mb-6">Email: {user.email}</p>

//         {message && <p className="mb-4 text-center text-red-600 font-semibold">{message}</p>}

//         {/* Budget Form */}
//         <div id="create" className="mb-6">
//           <BudgetForm
//             onSubmit={handleSubmit}
//             initial={editing || {}}
//             loading={loading}
//           />
//         </div>

//         {/* Budgets Table */}
//         <div id="view">
//           <h2 className="text-2xl font-bold mb-3 text-blue-800">Your Budgets</h2>
//           {loading ? (
//             <div className="mb-4">Loading...</div>
//           ) : (
//             <div className="overflow-x-auto rounded-2xl">
//               <table className="min-w-full bg-white/90 rounded-2xl shadow-lg">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 text-blue-800">Category</th>
//                     <th className="py-2 px-4 text-blue-800">Limit</th>
//                     <th className="py-2 px-4 text-blue-800">Month</th>
//                     <th className="py-2 px-4 text-blue-800">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {budgets.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="text-center py-4 text-blue-400">
//                         No budgets yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     budgets.map(budget => (
//                       <tr key={budget._id} className="text-center border-t border-blue-100 hover:bg-blue-50 transition-colors">
//                         <td className="py-2 px-4">{budget.category}</td>
//                         <td className="py-2 px-4">{budget.limit}</td>
//                         <td className="py-2 px-4">{budget.month}</td>
//                         <td className="py-2 px-4 flex justify-center gap-3">
//                           <button
//                             onClick={() => setEditing(budget)}
//                             className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded font-semibold text-white transition-all"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(budget._id)}
//                             className={`${BTN_DELETE} px-3 py-1 rounded font-semibold text-white transition-all`}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import BudgetsSection from "./BudgetsSection"; // Your budgets code
// import ExpensesSection from "./ExpensesSection"; // Similar to budgets, for expenses

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("budgets");

//   return (
//     <div className="min-h-screen bg-blue-100">
//       {/* Navbar here */}
//       <div className="flex justify-center mt-8">
//         <button
//           onClick={() => setActiveTab("budgets")}
//           className={`px-6 py-2 ${activeTab === "budgets" ? "bg-blue-600 text-white" : "bg-white text-blue-600"} rounded-l font-bold`}
//         >
//           Budgets
//         </button>
//         <button
//           onClick={() => setActiveTab("expenses")}
//           className={`px-6 py-2 ${activeTab === "expenses" ? "bg-blue-600 text-white" : "bg-white text-blue-600"} rounded-r font-bold`}
//         >
//           Expenses
//         </button>
//       </div>
//       <div className="max-w-2xl mx-auto mt-8">
//         {activeTab === "budgets" && <BudgetsSection />}
//         {activeTab === "expenses" && <ExpensesSection />}
//       </div>
//     </div>
//   );
// }


import Navbar from "./Navbar";
import Profile from "./Profile";
import BudgetsSection from "./BudgetsSection";
import ExpensesSection from "./ExpensesSection";
import { useState } from "react";

export default function Dashboard() {
  // Robust user load: redirect to login if not found
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/login";
      return null;
    }
    return JSON.parse(stored);
  });
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("budgets");

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  function handleProfileSave(updated) {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setShowProfile(false);
    // Optionally, send PATCH/PUT to backend to save changes
  }

  // Avoid rendering if user is null (redirect in progress)
  if (!user) return null;

  return (
    <div className="bg-blue-100 min-h-screen">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onProfile={() => setShowProfile(true)}
      />
      {showProfile && (
        <Profile
          user={user}
          onClose={() => setShowProfile(false)}
          onSave={handleProfileSave}
        />
      )}
      {/* Tabs */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setActiveTab("budgets")}
          className={`px-6 py-2 font-bold rounded-t ${activeTab === "budgets" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
        >Budgets</button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-6 py-2 font-bold rounded-t ${activeTab === "expenses" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
        >Expenses</button>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-4xl px-4 lg:ml-32">
          {activeTab === "budgets" && <BudgetsSection />}
          {activeTab === "expenses" && <ExpensesSection />}
        </div>
      </div>
    </div>
  );
}