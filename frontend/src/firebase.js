import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let app, database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log("Firebase connection established", database);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export const subscribeToVenueState = (callback) => {
  if (!database) {
    console.warn("Database not initialized, returning mock data");
    const mockState = {
      crowd_density: { section_a: 50, section_b: 60, section_c: 40, section_d: 80 },
      wait_times: { food_stand_1: 10, restroom_north: 5, merch_store: 15 },
      alerts: [{ id: 1, severity: 'low', message: 'Mock data initialized' }],
      personnel: [{ id: 'p1', role: 'security', location: 'Section A' }]
    };
    callback(mockState);
    return () => {};
  }

  let delay = 1000;
  const maxDelay = 30000;
  let isConnected = true;

  const connectedRef = ref(database, ".info/connected");
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log("Connected to Firebase Realtime Database");
      delay = 1000; // Reset backoff
      isConnected = true;
    } else {
      console.log("Disconnected from Firebase.");
      isConnected = false;
    }
  });

  const stateRef = ref(database, 'venue_state');
  
  const unsubscribe = onValue(stateRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Firebase Payload Received via onValue");
    if (data) {
      callback(data);
    } else {
      console.warn("Firebase snapshot is null/empty.");
    }
  }, (error) => {
    console.error("Error strictly fetching data via Firebase Hook:", error);
    // Explicit exponential backoff retry in case of permission issues
    if (!isConnected) {
      setTimeout(() => {
        delay = Math.min(delay * 2, maxDelay);
        console.log(`Re-attempting Firebase subscription in ${delay}ms`);
        subscribeToVenueState(callback); // recursive attempt
      }, delay);
    }
  });

  return unsubscribe;
};
