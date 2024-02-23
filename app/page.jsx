'use client'
import { useEffect, useState } from "react"
import {account, ID} from './appwrite'

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        setUser(await account.get());
        setLoadingUser(false);
      } catch (error) {
        console.error(error);
        setLoadingUser(false);
      }
    }
    getUser();
  }, []);

  async function handleLogout() {
    try {
      setLoadingAction(true);
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  // Function to clear error message
  function clearError() {
    setError(null);
  }

  async function handleLogin() {
    try {
      setLoadingAction(true);
      await account.createEmailSession(email, password);
      setUser(await account.get());
      setEmail('');
      setPassword('');
      clearError(); // Clear error after successful login
    } catch (error) {
      if (error.code === 401) {
        setError("Password incorrect, please try one more time");
      } else if (error.code === 404) {
        setError("You currently don't have an account with us, please click on register");
      } else {
        setError(error.message);
      }
    } finally {
      setLoadingAction(false);
    }
  }
  
  async function handleRegister() {
    try {
      setLoadingAction(true);
      await account.create(ID.unique(), email, password);
      await handleLogin();
      clearError(); // Clear error after successful registration
    } catch (error) {
      if (error.code === 107) {
        setError("You already have an account created with us");
      } else {
        setError(error.message);
      }
    } finally {
      setLoadingAction(false);
    }
  }

  if (loadingUser){
    return (
      <div className="bg-gray-800 p-8 max-w-sm mx-auto rounded-lg shadow-md mt-10">
        <div className="flex items-center space-x-4">
          <svg className="animate-spin h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-semibold text-lg">Loading user...</p>
        </div>
      </div>
    )
  }

  if (user){
    return (
      <div className="bg-gray-800 p-8 max-w-sm mx-auto rounded-lg shadow-md mt-10">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-blue-500 mr-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-white font-semibold text-lg">You're already logged in</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full m-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    )
  }


  return (
    <main className="dark:black min-h-screen flex flex-col items-center justify-center p-10 relative">
      <h1 className="text-3xl font-bold text-white mb-6">Log In or Sign Up Page</h1>
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      <form className={`space-y-6 w-72 ${loadingAction ? 'blur' : ''}`}>
        <input 
          type="email" 
          placeholder='Email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="dark:bg-black dark:text-white w-full p-3 rounded-md border border-white focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="dark:bg-black dark:text-white w-full p-3 rounded-md border border-white focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <div className="flex space-x-4">
          <button 
            type="button" 
            onClick={handleLogin}
            disabled={loadingAction} // Disable button while loading
            className="w-full p-3 rounded-md border border-white text-white hover:bg-white hover:text-black focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={handleRegister}
            disabled={loadingAction} // Disable button while loading
            className="w-full p-3 rounded-md border border-white text-white hover:bg-white hover:text-black focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            Register
          </button>
        </div>
      </form>
      {loadingAction && (
        <div className="watch-container">
          <div className="watch"></div>
        </div>
      )}
    </main>
  );    
}
