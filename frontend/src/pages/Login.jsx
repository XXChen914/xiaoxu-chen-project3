import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import FormField from "../components/FormField.jsx";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add real login logic
  };

  const goRegister = () => {
    navigate("/register");
  };

  return (
    <Layout title="Log in" subtitle="Welcome Back!">
      <form className="form" method="post" action="#" onSubmit={handleSubmit}>
        <FormField
          id="username"
          label="Username"
          placeholder="username"
          type="text"
        />

        <FormField
          id="password"
          label="Password"
          placeholder="password"
          type="password"
        />

        <div className="submit-row">
          <button className="btn" type="submit">
            Log in
          </button>
        </div>

        <div className="submit-row">
          <span className="small">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={goRegister}
            >
              Sign up
            </button>
          </span>
        </div>
      </form>
    </Layout>
  );
}
