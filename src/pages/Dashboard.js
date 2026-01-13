import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

/* CHARTS */
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const user = auth.currentUser;

 
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("month");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");

  const [safePerDay, setSafePerDay] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setExpenses(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, [user]);

  
  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setMonthlyBudget(snap.data().monthlyBudget || 0);
      }
    };

    fetchBudget();
  }, [user]);

 
  const saveBudget = async () => {
    if (!budgetInput) return;

    await setDoc(
      doc(db, "users", user.uid),
      { monthlyBudget: Number(budgetInput) },
      { merge: true }
    );

    setMonthlyBudget(Number(budgetInput));
    setBudgetInput("");
  };

 
  const now = new Date();

  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);

    if (filter === "day")
      return d.toDateString() === now.toDateString();

    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }

    if (filter === "month")
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );

    if (filter === "year")
      return d.getFullYear() === now.getFullYear();

    return true;
  });


  const totalSpent = filtered.reduce((s, e) => s + e.amount, 0);

  const monthSpent = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, e) => s + e.amount, 0);

  const remaining = monthlyBudget - monthSpent;

  
  useEffect(() => {
    if (!monthlyBudget) return;

    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const daysLeft = Math.max(
      daysInMonth - now.getDate() + 1,
      1
    );

    const safe = remaining / daysLeft;
    setSafePerDay(Math.max(0, safe.toFixed(0)));

    if (remaining < 0)
      setAlertMsg("🔴 Budget exceeded. Stop unnecessary spending.");
    else if (safe < 300)
      setAlertMsg("🟠 Very low daily limit left. Spend carefully.");
    else if (safe < 1000)
      setAlertMsg("🟡 Moderate daily limit. Plan your expenses.");
    else
      setAlertMsg("🟢 You are spending wisely. Keep it up!");
  }, [monthlyBudget, remaining]);

  


  const categoryMap = {};
  filtered.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#c77dff",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#fb7185",
        ],
        borderWidth: 0,
      },
    ],
  };

 
  const dailyMap = {};
  filtered.forEach((e) => {
    dailyMap[e.date] = (dailyMap[e.date] || 0) + e.amount;
  });

  const lineData = {
    labels: Object.keys(dailyMap),
    datasets: [
      {
        label: "Daily Spend ₹",
        data: Object.values(dailyMap),
        borderColor: "#c77dff",
        backgroundColor: "rgba(199,125,255,0.25)",
        tension: 0.4,
        fill: true,
      },
    ],
  };


  const monthMap = {};
  expenses.forEach((e) => {
    const m = new Date(e.date).toLocaleString("default", {
      month: "short",
    });
    monthMap[m] = (monthMap[m] || 0) + e.amount;
  });

  const barData = {
    labels: Object.keys(monthMap),
    datasets: [
      {
        label: "Monthly Spend ₹",
        data: Object.values(monthMap),
        backgroundColor: "#7c3aed",
        borderRadius: 10,
      },
    ],
  };


  const addExpense = async () => {
    if (!amount || !category || !date) return;

    await addDoc(collection(db, "users", user.uid, "expenses"), {
      amount: Number(amount),
      category,
      date,
      createdAt: Timestamp.now(),
    });

    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          min-height: 100vh;
          padding: 120px 60px 60px;
          background: linear-gradient(135deg, #0f172a, #020617);
          color: white;
        }

        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        select {
          padding: 8px 14px;
          border-radius: 12px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 16px;
        }

        .card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          padding: 20px;
          border-radius: 20px;
        }

        .alert {
          margin: 12px 0 24px;
          font-size: 15px;
        }

        .charts {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .bar {
          margin-bottom: 24px;
        }

        .add,
        .budget {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        input {
          padding: 12px;
          border-radius: 12px;
          border: none;
        }

        button {
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #c77dff, #7c3aed);
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .charts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="top">
        <h1>📊 Dashboard</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Spent</h3>
          <p>₹ {totalSpent}</p>
        </div>
        <div className="card">
          <h3>Remaining</h3>
          <p>₹ {remaining}</p>
        </div>
        <div className="card">
          <h3>Safe / Day</h3>
          <p>₹ {safePerDay}</p>
        </div>
      </div>

      {alertMsg && <div className="card alert">{alertMsg}</div>}

      <div className="charts">
        <div className="card">
          <Line data={lineData} />
        </div>
        <div className="card">
          <Pie data={pieData} />
        </div>
      </div>

      <div className="card bar">
        <Bar data={barData} />
      </div>

      <div className="card budget">
        <input
          type="number"
          placeholder="Set Monthly Budget ₹"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <button onClick={saveBudget}>Save Budget</button>
      </div>

      <div className="card add">
        <input
          type="number"
          placeholder="Amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>
    </div>
  );
}

export default Dashboard;
