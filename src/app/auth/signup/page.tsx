'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
      // In a real application, you would make an API call to create the user
      // For now, we'll just redirect to the sign-in page
      router.push('/auth/signin');
    } catch (error) {
      setError('アカウントの作成に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auth-container">
        <h1 className="text-3xl font-bold text-center mb-8">新規登録</h1>
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">パスワード</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">パスワード（確認）</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            アカウント作成
          </button>
        </form>
      </div>
    </div>
  );
}
