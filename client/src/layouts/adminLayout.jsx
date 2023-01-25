
import useFetch from "hooks/useFetch";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { data, loading, error, send } = useFetch({
    url: 'http://localhost:4000/admin/validate',
    authType: 'admin'
  });

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (error && !data) {
      navigate('/admin', { replace: true });
    }
  }, [loading]);

  return (
    <div className="main">
      <nav className="p-y-1 bg-dark fg-light">
        <div className="container flex v-center">
          Admin logged: { data?.username }
        </div>
      </nav>
      { children }
    </div>
  );
}

export default AdminLayout;

