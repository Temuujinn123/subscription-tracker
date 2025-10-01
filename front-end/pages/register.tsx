import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import TermsModal from "@/components/TermsModal";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async () => {
    if (name.trim() === "") return setError("Please enter your name");

    if (email.trim() === "") return setError("Please enter your email");

    if (!emailRegex.test(email.trim()))
      return setError("Please enter valid email");

    if (password.trim() !== confirmPassword.trim()) {
      return setError("Passwords do not match");
    }

    if (password.trim().length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    if (!termsAgree) return setError("Please accept terms and condition");

    setError("");
    setIsLoading(true);

    try {
      await signUp(name.trim(), email.trim(), password.trim());
    } catch (error) {
      console.error(error);
      setError("Failed to create an account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Create your account"
        subtitle="Already have an account?"
        alternateLink="/login"
        alternateLinkText="Sign in"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        {error && (
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
            role="alert"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md space-y-4">
          <FormInput
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            label="Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            }
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email address"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password (min. 6 characters)"
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            id="confirm-password"
            name="confirm-password"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={termsAgree}
            onChange={() => setTermsAgree(!termsAgree)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 transition-colors duration-200"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            I agree to the
          </label>
          <p
            onClick={() => setTermsModalOpen(true)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer ml-1"
          >
            Terms and Conditions
          </p>
        </div>
      </AuthForm>

      <TermsModal
        isOpen={termsModalOpen}
        setIsOpen={setTermsModalOpen}
        termsAgree={termsAgree}
        setTermsAgree={setTermsAgree}
      />
    </>
  );
}
