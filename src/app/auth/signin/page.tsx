'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('認証に失敗しました。');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('エラーが発生しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-container">
        <h1 className="text-3xl font-bold text-center mb-8">サインイン</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">メール</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">パスワード</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            サインイン
          </button>
        </form>
      </div>
    </div>
  );
}
