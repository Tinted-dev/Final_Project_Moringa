import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Region {
  id: number;
  name: string;
}

const RegionsPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [newRegion, setNewRegion] = useState('');
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const fetchRegions = async () => {
    try {
      const res = await axios.get('/api/admin/regions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegions(res.data);
    } catch (err) {
      console.error('Error fetching regions:', err);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleAdd = async () => {
    if (!newRegion.trim()) return;
    try {
      const res = await axios.post(
        '/api/admin/regions',
        { name: newRegion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegions([...regions, res.data]);
      setNewRegion('');
    } catch (err) {
      console.error('Add region error:', err);
    }
  };

  const handleUpdate = async () => {
    if (!editingRegion || !editingRegion.name.trim()) return;
    try {
      const res = await axios.put(
        `/api/admin/regions/${editingRegion.id}`,
        { name: editingRegion.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegions(
        regions.map(r => (r.id === res.data.id ? res.data : r))
      );
      setEditingRegion(null);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/regions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegions(regions.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Region Management</h2>

      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          type="text"
          placeholder="New region name"
          value={newRegion}
          onChange={e => setNewRegion(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAdd}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {regions.map(region => (
          <li key={region.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editingRegion?.id === region.id ? (
              <>
                <input
                  type="text"
                  value={editingRegion.name}
                  onChange={e =>
                    setEditingRegion({ ...editingRegion, name: e.target.value })
                  }
                  className="form-control me-2"
                />
                <button className="btn btn-primary me-2" onClick={handleUpdate}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingRegion(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{region.name}</span>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => setEditingRegion(region)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(region.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegionsPage;
