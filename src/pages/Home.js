import React, { useEffect, useState } from "react";

const texts = [
  "Start using Budget Buddy to unlock insights 🚀",
  "Track your expenses effortlessly 📊",
"Visualize your spending smartly 📈",
"Build better financial habits 💡",
"Earn rewards 🎁",
"Plan your savings 🎯"


];

function Home() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < texts[textIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + texts[textIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, 75);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setTextIndex((textIndex + 1) % texts.length);
      }, 1500);
    }
  }, [charIndex, textIndex]);

  return (
    <div className="home">
      <style>{`
        .home {
          height: 100vh;
          background: url("https://images.unsplash.com/photo-1580519542036-c47de6196ba5")
            center / cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .overlay {
          background: rgba(0,0,0,0.65);
          padding: 60px 90px;
          border-radius: 26px;
          font-size: 42px;
          font-weight: 600;
          backdrop-filter: blur(12px);
          text-align: center;
          box-shadow: 0 40px 80px rgba(0,0,0,0.45);
        }

        @media (max-width: 768px) {
          .overlay {
            font-size: 30px;
            padding: 40px 50px;
          }
        }
      `}</style>

      <div className="overlay">{displayText}</div>
    </div>
  );
}

export default Home;
