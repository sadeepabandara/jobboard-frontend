import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  user_id: number;
  created_at: string;
}

const Jobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resumeFiles, setResumeFiles] = useState<{
    [key: number]: File | null;
  }>({});

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${API_URL}/jobs`,
        { title, description, company },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess("Job created successfully!");
      setTitle("");
      setDescription("");
      setCompany("");
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create job");
    }
  };

  const handleFileChange = (jobId: number, file: File | null) => {
    setResumeFiles((prev) => ({ ...prev, [jobId]: file }));
  };

  const handleApply = async (jobId: number) => {
    try {
      const formData = new FormData();
      formData.append("job_id", jobId.toString());

      const file = resumeFiles[jobId];
      if (file) {
        formData.append("resume", file);
      }

      await axios.post(`${API_URL}/applications`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Applied successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a Job</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleCreateJob}>
          <input
            style={styles.input}
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <textarea
            style={styles.textarea}
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <button style={styles.button} type="submit">
            Post Job
          </button>
        </form>
      </div>

      <div style={styles.jobsList}>
        <h2 style={styles.title}>Available Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <h3 style={styles.jobTitle}>{job.title}</h3>
              <p style={styles.company}>{job.company}</p>
              <p style={styles.description}>{job.description}</p>
              <p style={styles.date}>
                Posted: {new Date(job.created_at).toLocaleDateString()}
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  handleFileChange(job.id, e.target.files?.[0] || null)
                }
                style={{ marginBottom: "0.5rem", display: "block" }}
              />
              <button
                style={styles.applyButton}
                onClick={() => handleApply(job.id)}
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "0 1rem",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  title: {
    color: "#1a1a2e",
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1a1a2e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "#e94560",
    marginBottom: "1rem",
  },
  success: {
    color: "green",
    marginBottom: "1rem",
  },
  jobsList: {
    marginTop: "1rem",
  },
  jobCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
  },
  jobTitle: {
    color: "#1a1a2e",
    marginBottom: "0.5rem",
  },
  company: {
    color: "#666",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  description: {
    color: "#444",
    marginBottom: "0.5rem",
  },
  date: {
    color: "#999",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  applyButton: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Jobs;
