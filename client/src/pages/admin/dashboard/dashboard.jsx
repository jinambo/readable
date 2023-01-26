import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import Books from './books';
import Users from './users';
import Button from 'components/atoms/button';
import styles from './dashboard.module.scss';
import Input from 'components/atoms/input';
import usePopMessage from 'hooks/usePopMessage';

const Dashboard = () => {
  // Navigate - for reloading the page after db import
  const navigate = useNavigate();

  // Export loading state
  const [isLoading, setIsLoading] = useState(false);

  // Import loading state
  const [isImporting, setIsImporting] = useState(false);

  // Import file state
  const [importFile, setImportFile] = useState(null);

  // Pop-up (error/success)
  const [popup, show] = usePopMessage();

  // Export handler
  const handleExport = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/admin/export', {
        headers: { Authorization: `Bearer ${ localStorage.getItem('adminToken') }` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.style.display = 'none';
      a.href = url;
      a.download = 'export.archive';
      document.body.appendChild(a);

      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitImport = () => {
    if (importFile) {
      setIsImporting(true);

      const formData = new FormData();
      formData.append('importFile', importFile);

      fetch('http://localhost:4000/admin/import', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${ localStorage.getItem('adminToken') }` },
      })
      .then(response => response.json())
      .then(data => {
        // Show pop-up message and then refresh the page to get new imported data loaded
        show(data.message, 'success');
        setTimeout(() => navigate(0), 2000);
      })
      .catch(error => {
        show(error, 'error');
      }).finally(() => setIsImporting(false))
    }
  }

  return (
    <>
      <Helmet>
        <title>Readable - admin dashboard</title>
      </Helmet>
      <div className="container p-y-2">
        <div className="flex h-between">
          <h1 className={`${ styles['dashboard'] } fg-dark`}>Admin dashboard</h1>
          <div className="flex flex-col h-end">
            <Button
              type="primary"
              styles={{ textAlign: 'center' }}
              disabled={ isLoading }
              onClickAction={ handleExport }
            >
              {isLoading ? 'Exporting data ...' : 'Export data from database'}
            </Button>

            <div className="flex v-center m-t-1">
              <Input
                name="importFile"
                type="file"
                accept=".archive"
                styles={{ width: '240px', background: '#eee' }}
                onChangeAction={ (e) => setImportFile(e.target.files[0]) }
              />
              <Button
                type="secondary"
                styles={{ textAlign: 'center', marginLeft: '0.5rem' }}
                disabled={ isImporting }
                onClickAction={ handleSubmitImport }
              >
                {isImporting ? 'Importing data ...' : 'Import data from file'}
              </Button>
            </div>
          </div>
        </div>
        
        { popup.message && popup.type === 'success' && <p className="pop-success m-y-2">{popup.message}</p> }
        { popup.message && popup.type === 'error' && <p className="pop-error m-y-2">{popup.message}</p> }

        <div className="grid">
          <Books />
          <Users />
        </div>
      </div>
    </>

  );
}

export default Dashboard;
