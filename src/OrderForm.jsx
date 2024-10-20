import React, { useState } from "react";
import Airtable from "airtable";
import jsPDF from "jspdf";
import Confetti from "react-confetti";

// Configurer Airtable API
//const base = new Airtable({ apiKey: "YOUR_AIRTABLE_API_KEY" }).base(
//  "YOUR_AIRTABLE_BASE_ID",
//);
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_TOKEN
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

const products = [
  {
    id: 1,
    name: "Le ballotin 500 g net - 42 chocolats assortis - 25 recettes",
    oldPrice: 29.4,
    newPrice: 20.6,
  },
  // ... tous les autres produits ici
];

const OrderForm = () => {
  const [clientInfo, setClientInfo] = useState({
    companyName: "",
    contactName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    siret: "",
    tva: "",
    deliveryDate: "",
  });

  const [orderItems, setOrderItems] = useState({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleClientInfoChange = (e) => {
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (productId, quantity) => {
    setOrderItems({ ...orderItems, [productId]: parseInt(quantity) || 0 });
  };

  const calculateSubtotal = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    return (product.newPrice * quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return Object.entries(orderItems)
      .reduce((total, [productId, quantity]) => {
        const product = products.find((p) => p.id === parseInt(productId));
        return total + product.newPrice * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !termsAccepted ||
      calculateTotal() === "0.00" ||
      !clientInfo.contactName ||
      !clientInfo.address ||
      !clientInfo.postalCode ||
      !clientInfo.city ||
      !clientInfo.email
    ) {
      alert(
        "Veuillez remplir tous les champs obligatoires et accepter les conditions générales de vente.",
      );
      return;
    }

    // Générer le PDF du bon de commande
    const doc = new jsPDF();
    doc.text("Bon de Commande - Jeff de Bruges", 10, 10);
    doc.text(`Nom du contact: ${clientInfo.contactName}`, 10, 20);
    doc.text(`Adresse: ${clientInfo.address}`, 10, 30);
    doc.text(`Code postal: ${clientInfo.postalCode}`, 10, 40);
    doc.text(`Ville: ${clientInfo.city}`, 10, 50);
    doc.text(`Email: ${clientInfo.email}`, 10, 60);
    doc.text(`Total: ${calculateTotal()} € TTC`, 10, 70);
    doc.save("Bon_de_Commande.pdf");

    // Enregistrer la commande dans Airtable
    base("Commandes").create(
      [
        {
          fields: {
            "Nom du contact": clientInfo.contactName,
            Adresse: clientInfo.address,
            "Code postal": clientInfo.postalCode,
            Ville: clientInfo.city,
            Email: clientInfo.email,
            "Total TTC": calculateTotal(),
          },
        },
      ],
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
      },
    );

    // Confirmer la commande et afficher la pop-up de remerciement
    setOrderSubmitted(true);
  };

  if (orderSubmitted) {
    return (
      <div>
        <Confetti />
        <div>
          Merci {clientInfo.contactName} pour votre commande ! Nous vous
          contacterons bientôt pour confirmer les détails.
        </div>
      </div>
    );
  }

  return (
    <div className="order-form">
      <h2>Jeff de Bruges</h2>
      <p>Jeff de Bruges Plaisir - C.cial Auchan Aushopping Grand Plaisir</p>
      <p>Commande à retourner avant le : 08/11/2024</p>
      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Raison sociale"
          value={clientInfo.companyName}
          onChange={handleClientInfoChange}
        />
        <input
          name="contactName"
          placeholder="Nom du contact *"
          value={clientInfo.contactName}
          onChange={handleClientInfoChange}
          required
        />
        <input
          name="address"
          placeholder="Adresse *"
          value={clientInfo.address}
          onChange={handleClientInfoChange}
          required
        />
        <input
          name="postalCode"
          placeholder="Code postal *"
          value={clientInfo.postalCode}
          onChange={handleClientInfoChange}
          required
        />
        <input
          name="city"
          placeholder="Ville *"
          value={clientInfo.city}
          onChange={handleClientInfoChange}
          required
        />
        <input
          name="phone"
          placeholder="Téléphone"
          value={clientInfo.phone}
          onChange={handleClientInfoChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={clientInfo.email}
          onChange={handleClientInfoChange}
          required
        />
        <input
          name="siret"
          placeholder="N° SIRET"
          value={clientInfo.siret}
          onChange={handleClientInfoChange}
        />
        <input
          name="tva"
          placeholder="N° TVA intra"
          value={clientInfo.tva}
          onChange={handleClientInfoChange}
        />
        <input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          value={clientInfo.deliveryDate}
          onChange={handleClientInfoChange}
        />
        <h3>Produits</h3>
        {products.map((product) => (
          <div key={product.id}>
            <div>{product.name}</div>
            <input
              type="number"
              min="0"
              value={orderItems[product.id] || ""}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            />
            <span>
              {calculateSubtotal(product.id, orderItems[product.id] || 0)}€ TTC
            </span>
          </div>
        ))}
        <div>Total: {calculateTotal()}€ TTC</div>
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="terms">
          Oui, j'ai pris connaissance des conditions générales de vente.
        </label>
        <button
          type="submit"
          disabled={!termsAccepted || calculateTotal() === "0.00"}
        >
          Passer la commande
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
