import { useState } from 'react';
import { FaBell, FaPlus, FaTrash, FaTimes, FaClock } from 'react-icons/fa';
import { API_BASE_URL } from './config';
import './RemindersPanel.css';

export default function RemindersPanel({ isOpen, onClose, reminders, setReminders }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', time: '', priority: 'medium' });



  const addReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.time) return;
    
    // Sync to backend first to get the Firestore ID
    try {
        const response = await fetch(`${API_BASE_URL}/api/reminders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...newReminder, 
            time: new Date(newReminder.time).toISOString(), // FIX: Send as UTC
            token: localStorage.getItem('fcm_token') 
          })
        });
        
        if (response.ok) {
          const savedReminder = await response.json();
          setReminders([...reminders, savedReminder]);
          console.log('Reminder synced to Firestore');
        }
    } catch (err) {
      console.error('Failed to sync reminder to backend:', err);
      // Fallback: local only if backend fails (though it won't persist well)
      setReminders([...reminders, { ...newReminder, id: Date.now(), enabled: true }]);
    }
    
    setNewReminder({ title: '', time: '', priority: 'medium' });
    setShowAdd(false);
  };


  const toggleReminder = async (id) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const newEnabled = !reminder.enabled;
    
    // Optimistic UI update
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: newEnabled } : r));

    // Sync to backend
    try {
      await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled })
      });
    } catch (err) {
      console.error('Failed to toggle reminder on backend:', err);
    }
  };

  const deleteReminder = async (id) => {
    // Optimistic UI update
    setReminders(reminders.filter(r => r.id !== id));

    // Sync to backend
    try {
      await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
        method: 'DELETE'
      });
      console.log('Reminder deleted from backend');
    } catch (err) {
      console.error('Failed to delete reminder from backend:', err);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="reminders-overlay" onClick={onClose}>
      <div className="reminders-panel" onClick={e => e.stopPropagation()}>
        <div className="reminders-header">
          <h3><FaBell /> Notifications & Reminders</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="reminders-content">
          <div className="reminders-list">
            {reminders.map(r => (
              <div key={r.id} className={`reminder-card ${r.priority}`}>
                <div className="reminder-info">
                  <h4>{r.title}</h4>
                  <p><FaClock /> {new Date(r.time).toLocaleString()}</p>
                </div>
                <div className="reminder-actions">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={r.enabled} 
                      onChange={() => toggleReminder(r.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <button className="delete-btn" onClick={() => deleteReminder(r.id)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>

          {showAdd ? (
            <form className="add-reminder-form" onSubmit={addReminder}>
              <input 
                type="text" 
                placeholder="Reminder Title" 
                value={newReminder.title}
                onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                required
              />
              <input 
                type="datetime-local" 
                value={newReminder.time}
                onChange={e => setNewReminder({...newReminder, time: e.target.value})}
                required
              />
              <select 
                value={newReminder.priority}
                onChange={e => setNewReminder({...newReminder, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Reminder</button>
              </div>
            </form>
          ) : (
            <button className="add-btn" onClick={() => setShowAdd(true)}>
              <FaPlus /> Add New Reminder
            </button>
          )}
        </div>

        <div className="reminders-footer">
          <p><small>Push notifications are handled via Firebase Cloud Messaging.</small></p>
        </div>
      </div>
    </div>
  );
}
