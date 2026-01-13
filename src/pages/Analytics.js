import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const user = auth.currentUser;
  const [expenses, setExpenses] = useState([]);

 
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });

    return () => unsubscribe();
  }, [user]);


  const categories = {};
  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: [
        "rgba(199,125,255,0.7)",
        "rgba(96,165,250,0.7)",
        "rgba(52,211,153,0.7)",
        "rgba(251,146,60,0.7)",
      ],
      borderWidth: 0,
    }]
  };

  
  const dailyTotals = {};
  expenses.forEach(e => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  const lineData = {
    labels: Object.keys(dailyTotals),
    datasets: [{
      label: "Daily Spend ₹",
      data: Object.values(dailyTotals),
      borderColor: "#c77dff",
      backgroundColor: "rgba(199,125,255,0.25)",
      tension: 0.4,
      fill: true,
    }]
  };

  
  const monthlyTotals = {};
  expenses.forEach(e => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
  });

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [{
      label: "Monthly Spend ₹",
      data: Object.values(monthlyTotals),
      backgroundColor: "rgba(199,125,255,0.6)",
      borderRadius: 10,
    }]
  };

  return (
    <div className="analytics-page">
      <style>{`
        .analytics-page {
          padding: 120px 80px;
          color: white;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 30px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        .glass-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
          transition: transform 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
        }
      `}</style>

      <h1>📊 Analytics</h1>

      <div className="analytics-grid">
        <div className="glass-card">
          <h3>Category Breakdown</h3>
          <Pie data={pieData} />
        </div>

        <div className="glass-card">
          <h3>Daily Spending Trend</h3>
          <Line data={lineData} />
        </div>

        <div className="glass-card">
          <h3>Monthly Comparison</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
