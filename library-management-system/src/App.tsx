import React, { useState, useEffect } from 'react';

interface LibraryRecord {
  id: number;
  name: string;
  description: string;
  date: string;
  status: string;
}

export default function App() {
  const [records, setRecords] = useState<LibraryRecord[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [deleteId, setDeleteId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await fetch('/api/library');
    const data = await res.json();
    setRecords(data);
  };

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, status }),
    });
    const result = await res.json();
    setMessage(`Record Inserted Successfully! Generated ID: ${result.id}`);
    setName('');
    setDescription('');
    fetchRecords();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/library/${id}`, { method: 'DELETE' });
    fetchRecords();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Library Management System</h1>
      <hr />
      
      <h3>I. Insert New Record</h3>
      {message && <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>{message}</div>}
      <form onSubmit={handleInsert}>
        <div>
          Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <br />
        <div>
          Description: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <br />
        <div>
          Status: 
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <br />
        <button type="submit">Insert Record</button>
      </form>

      <hr />

      <h3>II. Delete Record by ID</h3>
      <div>
        Enter ID to Delete: <input 
          type="number" 
          value={deleteId} 
          onChange={(e) => setDeleteId(e.target.value)} 
          placeholder="e.g. 1"
        />
        <button onClick={() => {
          if(deleteId) {
            handleDelete(Number(deleteId));
            setDeleteId('');
          }
        }}>Delete by ID</button>
      </div>

      <hr />

      <h3>III. Library Records</h3>
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.description}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
              <td>
                <button onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
