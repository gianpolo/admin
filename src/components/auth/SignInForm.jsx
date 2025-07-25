import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeftIcon } from "../../icons";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Spinner from "../ui/spinner/Spinner";
import { useAuth } from "../../context/AuthContext";
export default function SignInForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const status = useSelector((state) => state.auth.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signIn(username, password);
      navigate("/self-schedulings");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="flex items-center mb-5 sm:mb-8">
            <div className="flex flex-1 flex-col">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use your account to sign in.</p>
            </div>
            <div className="flex px-6">{status === "loading" && <Spinner />}</div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  disabled={status === "loading"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  disabled={status === "loading"}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" size="sm" type="submit" disabled={status === "loading"}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
