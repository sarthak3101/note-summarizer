import { useState } from "react";
import axios from "axios";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  type SummaryResponse = {
  summary: string;
};

const handleSummarize = async () => {
  setLoading(true);
  setError("");
  setSummary("");

  try {
    const token = localStorage.getItem("access_token");
    const res = await axios.post<SummaryResponse>(
      "http://localhost:5000/summarize",
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", res.data);
    setSummary(res.data.summary);
  } catch (err: any) {
    setError(err.response?.data?.error || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Note Summarizer</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded-lg"
        rows={6}
        placeholder="Paste your notes here..."
      />
      <button
        onClick={handleSummarize}
        disabled={loading || !text.trim()}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="bg-gray-100 p-4 rounded">{summary}</p>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
