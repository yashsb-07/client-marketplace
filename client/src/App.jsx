import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/health"
        );

        setMessage(response.data.message);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setMessage("Backend connection failed");
      }
    };

    checkBackend();
  }, []);

  return (
    <main>
      <h1>Client Marketplace</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;