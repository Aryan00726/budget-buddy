import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Savings() {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [months, setMonths] = useState("");
  const [userData, setUserData] = useState(null);

  const uid = auth.currentUser.uid;

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUserData(snap.data());
    };
    fetchData();
  }, [uid]);

  const createGoal = async () => {
    if (!goalName || !target || !months) return;

    const goalId = Date.now().toString();

    await setDoc(
      doc(db, "users", uid),
      {
        savingsGoals: {
          [goalId]: {
            name: goalName,
            target: Number(target),
            months: Number(months),
            createdAt: serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    window.location.reload();
  };

  if (!userData) return null;

  const saved = userData.usage?.savedAmount || 0;
  const goals = userData.savingsGoals || {};

  return (
    <div className="page">
      <h1 className="page-title">💰 Savings Goals</h1>

      {}
      <div className="glass-card">
        <h2>Create New Goal</h2>

        <input
          placeholder="Goal name (e.g. Headphones)"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target amount (₹)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          type="number"
          placeholder="Months to achieve"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />

        <button onClick={createGoal}>Add Goal</button>
      </div>

      {}
      <div className="voucher-list">
        {Object.entries(goals).map(([id, g]) => {
          const progress = Math.min(
            (saved / g.target) * 100,
            100
          );

          const monthly = g.target / g.months;
          const daily = monthly / 30;
          const completed = saved >= g.target;

          return (
            <div className="voucher-card" key={id}>
              <div className="voucher-logo">🎯</div>

              <div className="voucher-content">
                <h2 className="voucher-brand">{g.name}</h2>

                <p className="voucher-offer">
                  Target: ₹{g.target}
                </p>

                <p className="voucher-criteria">
                  Save ₹{monthly.toFixed(0)}/month · ₹
                  {daily.toFixed(0)}/day
                </p>

                {}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p>{progress.toFixed(1)}% completed</p>

                {}
                {completed ? (
                  <span className="voucher-status redeemed">
                    ✅ Completed
                  </span>
                ) : (
                  <span className="voucher-status active">
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
