import { useState } from "react";
import ContactForm from "./components/ContactForm";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [view, setView] = useState("form");

  return (
    <div className="app">
      <header className="app-header">
<img
          src="/form_icon.png"
          alt="Smart Contact Form"
          style={{ marginBottom: "10px", height: "80px" }}
        />

        <h1>Smart Contact Form</h1>
        <p>Powered by AWS Serverless</p>
        <button
          className="btn-admin-toggle"
          onClick={() => setView(view === "form" ? "admin" : "form")}
        >
          {view === "form" ? "🔐 Admin" : "← Form"}
        </button>
      </header>

      <main className="app-main">
        {view === "form" ? (
          <ContactForm />
        ) : (
          <AdminDashboard onBack={() => setView("form")} />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + AWS Lambda + SES + DynamoDB</p>
      </footer>
    </div>
  );
}

export default App;




