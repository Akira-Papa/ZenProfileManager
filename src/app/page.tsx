import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">和風認証</h1>
      <p className="text-xl mb-8 text-center">Japanese-inspired Authentication</p>
      <div className="space-y-4">
        <Link 
          href="/auth/signin" 
          className="block px-8 py-3 bg-bamboo-green text-white rounded-md hover:opacity-90 transition-opacity"
        >
          サインイン | Sign In
        </Link>
        <Link 
          href="/auth/signup" 
          className="block px-8 py-3 border border-bamboo-green text-bamboo-green rounded-md hover:bg-bamboo-green hover:text-white transition-colors"
        >
          新規登録 | Sign Up
        </Link>
      </div>
    </main>
  )
}
