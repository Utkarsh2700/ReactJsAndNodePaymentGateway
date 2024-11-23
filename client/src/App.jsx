import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <h1>Phone Pe Payment Gateway Integration</h1>
      <Hero />
    </>
  );
}

export default App;
