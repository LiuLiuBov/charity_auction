import { useState, createContext, useContext, useEffect } from 'react';

const authContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ token });
    }
  }, []);

  const signIn = (newAuth) => {
    setAuth(newAuth);
    localStorage.setItem('token', newAuth.token);
  };

  const signOut = () => {
    setAuth(null);
    localStorage.removeItem('token');
  };

  return (
    <authContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}
