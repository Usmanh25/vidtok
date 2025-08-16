import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useAuthStore from '../store/authStore';

type SignupModalProps = {
  onClose: () => void;
  onSwitchToLogin: () => void;
};

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitchToLogin }) => {
  const { setUserProfile, login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserProfile(data.user);
        window.location.reload();
      } else {
        setError(data.error || 'Signup failed');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    try {
      const success = await login('guest@example.com', 'password');
      if (success) {
        window.location.reload();
      } else {
        setError('Demo login failed.');
      }
    } catch (err) {
      setError('Demo login failed.');
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-[400px] h-[550px] max-w-[32rem] min-h-[24rem] relative flex flex-col justify-between">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-2xl hover:text-gray-700"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Sign up for VidTok</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4 flex-1 justify-center"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded text-sm"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded text-sm"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#FE2C55] hover:bg-[#e0264b] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded text-sm font-semibold transition"
          >
            {submitting ? 'Signing up…' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="bg-[#FE2C55] hover:bg-[#e0264b] text-white py-3 rounded text-sm font-semibold transition"
          >
            Continue as Guest
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                // onClose();          
                onSwitchToLogin();
              }}
              className="text-[#FE2C55] hover:underline font-medium"
            >
              Log In!
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignupModal;
