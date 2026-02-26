export const debugFirebase = () => {
  console.log('=== Firebase Debug Info ===');
  console.log('API Key exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
  console.log('API Key starts with:', process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10));
  console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
  console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
  console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
};

// Call this in your App.tsx useEffect
