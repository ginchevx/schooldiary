import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const TestFirebase: React.FC = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if Firebase initialized
        if (!db) throw new Error('Firestore not initialized');
        if (!auth) throw new Error('Auth not initialized');
        
        setStatus('✅ Firebase initialized');

        // Test 2: Try to read from Firestore
        const testQuery = query(collection(db, 'users'), limit(1));
        const snapshot = await getDocs(testQuery);
        
        setStatus(prev => prev + '\n✅ Can read from Firestore');
        
        // Test 3: Check if any collections exist
        if (snapshot.empty) {
          setStatus(prev => prev + '\n⚠️ No users found yet - will be created on first login');
        } else {
          setStatus(prev => prev + `\n✅ Found ${snapshot.size} user(s)`);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Firebase connection error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="font-bold mb-2">Firebase Connection Test</h2>
      <pre className="whitespace-pre-wrap text-sm">
        {status}
      </pre>
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};
