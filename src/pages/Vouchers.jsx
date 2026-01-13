import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const voucherConfig = [
  {
    id: "amazon",
    brand: "Amazon",
    logo: "🛒",
    offer: "₹100 off on orders above ₹999",
    requirement: 7,
    type: "daysActive",
  },
  {
    id: "swiggy",
    brand: "Swiggy",
    logo: "🍔",
    offer: "₹150 off on food orders",
    requirement: 10,
    type: "expensesCount",
  },
  {
    id: "netflix",
    brand: "Netflix",
    logo: "🎬",
    offer: "1 Month Free Subscription",
    requirement: 1000,
    type: "savedAmount",
  },
];

export default function Vouchers() {
  const [usage, setUsage] = useState(null);
  const [redeemed, setRedeemed] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser.uid;
      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        const data = snap.data();
        setUsage(data.usage || {});
        setRedeemed(data.vouchers || {});
      }
    };

    fetchData();
  }, []);

  if (!usage) return null;

  return (
    <div className="page">
      <h1 className="page-title">🎟 Vouchers</h1>

      <div className="voucher-list">
        {voucherConfig.map((v) => {
          const current = usage[v.type] || 0;
          const percent = Math.min(
            (current / v.requirement) * 100,
            100
          );

          const isRedeemed = redeemed[v.id]?.redeemed;
          const isUnlocked = current >= v.requirement;

          return (
            <div className="voucher-card" key={v.id}>
              <div className="voucher-logo">{v.logo}</div>

              <div className="voucher-content">
                <h2 className="voucher-brand">{v.brand}</h2>
                <p className="voucher-offer">{v.offer}</p>

                <p className="voucher-criteria">
                  Progress: {current} / {v.requirement}
                </p>

                {}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {}
                {isRedeemed ? (
                  <span className="voucher-status redeemed">Redeemed</span>
                ) : isUnlocked ? (
                  <span className="voucher-status active">Active</span>
                ) : (
                  <span className="voucher-status locked">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
