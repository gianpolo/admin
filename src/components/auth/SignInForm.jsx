import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext.jsx";
export default function SignInForm() {
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.signinRedirect();
        }
        catch (err) {
            console.error(err);
        }
    };
    return (<div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ChevronLeftIcon className="size-5"/>
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use your account to sign in.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Button className="w-full" size="sm" type="submit">
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>);
}
