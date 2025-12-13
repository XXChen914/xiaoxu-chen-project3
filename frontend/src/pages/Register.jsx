import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import FormField from "../components/FormField.jsx";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add real register logic
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
          <button
            type="button"
            className="link-btn"
            onClick={goLogin}
          >
            Log in
          </button>
        </>
      }
    >
      <form className="form" method="post" action="#" onSubmit={handleSubmit}>
        <FormField
          id="reg-username"
          name="username"
          label="Username"
          placeholder="username"
          type="text"
        />

        <FormField
          id="reg-password"
          name="password"
          label="Password"
          placeholder="password"
          type="password"
        />

        <FormField
          id="reg-password-verify"
          name="password-verify"
          label="Verify Password"
          placeholder="retype password"
          type="password"
        />

        <div className="submit-row">
          <button className="btn" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </Layout>
  );
}
