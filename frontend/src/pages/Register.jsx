import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import FormField from "../components/FormField.jsx";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordVerify: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.username || !formData.password || !formData.passwordVerify) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.passwordVerify) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          verifyPassword: formData.passwordVerify,
        }),
        credentials: "include", // important for cookies
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful, redirect to /games
      navigate("/games");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <Layout
      title="Create an account"
      subtitle={
        <>
          Already have an account?{" "}
          <button type="button" className="link-btn" onClick={goLogin}>
            Log in
          </button>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit}>
        <FormField
          id="reg-username"
          name="username"
          label="Username"
          placeholder="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />

        <FormField
          id="reg-password"
          name="password"
          label="Password"
          placeholder="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <FormField
          id="reg-password-verify"
          name="password-verify"
          label="Verify Password"
          placeholder="retype password"
          type="password"
          value={formData.passwordVerify}
          onChange={handleChange}
        />
        {error && <div className="error-message">{error}</div>}
        <div className="submit-row">
          <button
            className="btn"
            type="submit"
            disabled={
              loading ||
              !formData.username ||
              !formData.password ||
              !formData.passwordVerify
            }
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
