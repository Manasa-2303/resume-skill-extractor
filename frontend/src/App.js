import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a resume PDF"); return; }
    if (!jd) { setError("Please paste a job description"); return; }
    setError("");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("job_description", jd);
    try {
      const res = await axios.post(`${API}/match`, form);
      setResult(res.data);
    } catch (e) {
      setError("Something went wrong. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="hero">
        <h1>Resume Skill Extractor</h1>
        <p>Upload your resume and paste a job description to see how well you match</p>
      </div>

      <div className="card">
        <div className="field">
          <label>Upload Resume (PDF)</label>
          <input type="file" accept=".pdf"
            onChange={e => setFile(e.target.files[0])} />
          {file && <span className="filename">✓ {file.name}</span>}
        </div>

        <div className="field">
          <label>Paste Job Description</label>
          <textarea
            rows={6}
            placeholder="Paste the full job description here..."
            value={jd}
            onChange={e => setJd(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>
      </div>

      {result && (
        <div className="card">
          <div className="score-circle">
            <span className="score-num">{result.match_result.match_score}%</span>
            <span className="score-lbl">Match Score</span>
          </div>

          <div className="skills-row">
            <div className="skills-box matched">
              <h3>✅ Matched Skills</h3>
              <div className="tags">
                {result.match_result.matched_skills.map(s => (
                  <span key={s} className="tag green">{s}</span>
                ))}
              </div>
            </div>

            <div className="skills-box missing">
              <h3>❌ Missing Skills</h3>
              <div className="tags">
                {result.match_result.missing_skills.map(s => (
                  <span key={s} className="tag red">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="resume-skills">
            <h3>📄 All Skills Found in Resume</h3>
            {Object.entries(result.resume_skills).map(([cat, skills]) => (
              <div key={cat} className="category">
                <span className="cat-label">{cat}</span>
                <div className="tags">
                  {skills.map(s => <span key={s} className="tag blue">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;