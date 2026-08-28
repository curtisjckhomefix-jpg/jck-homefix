"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="w-full max-w-sm">
      <label htmlFor="code" className="stamp block text-carbon-500">
        Access code
      </label>
      <input
        id="code"
        name="code"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        className="mt-3 w-full border-2 border-carbon-700 bg-carbon-900 px-4 py-3.5 font-mono text-paper-50 transition-colors focus:border-hivis-400 focus:outline-none"
      />

      {state.error ? (
        <p role="alert" className="mt-4 border-l-2 border-siren-500 pl-4 text-sm text-siren-500">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full bg-hivis-400 px-6 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 transition-colors hover:bg-hivis-300 disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
