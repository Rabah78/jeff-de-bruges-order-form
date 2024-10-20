import React from "react";
import "./App.css"; // Assure-toi que ce fichier existe bien
import OrderForm from "./OrderForm"; // Assure-toi que le chemin vers `OrderForm` est correct, sinon ajuste vers './components/OrderForm' si nécessaire

function App() {
  return (
    <main>
      <OrderForm />
    </main>
  );
}

export default App;
