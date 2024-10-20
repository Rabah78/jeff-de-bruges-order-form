import React, { useState } from "react";
import jsPDF from "jspdf";
import Confetti from "react-confetti";
import emailjs from "@/emailjs-com";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import Airtable from 'airtable';

// Configurer Airtable API
const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_TOKEN
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

const products = [
  { id: 1, name: "Le ballotin 500 g net - 42 chocolats assortis - 25 recettes", oldPrice: 29.40, newPrice: 20.60 },
  { id: 2, name: "Le ballotin 250 g net - 21 chocolats assortis - 21 recettes", oldPrice: 14.70, newPrice: 10.30 },
  { id: 3, name: "Le ballotin 1 kg net - 84 chocolats assortis - 25 recettes", oldPrice: 58.80, newPrice: 41.15 },
  { id: 4, name: "Le ballotin 500 g net - 42 chocolats noirs - 14 recettes", oldPrice: 29.40, newPrice: 20.60 },
  { id: 5, name: "Le ballotin 500 g net - 42 chocolats au lait - 12 recettes", oldPrice: 29.40, newPrice: 20.60 },
  { id: 6, name: "Le ballotin 500 g net - 42 chocolats blancs - 8 recettes", oldPrice: 29.40, newPrice: 20.60 },
  { id: 7, name: "La boite Truffes 350 g net - 30 truffes assorties - 4 recettes", oldPrice: 26.70, newPrice: 19.00 },
  { id: 8, name: "La boule de Noël en métal 64 g net - garnie de Choco'pralinés et de carrés de chocolat au lait", oldPrice: 8.00, newPrice: 6.30 },
  { id: 9, name: "La boite Palets 250 g net - 24 palets assortis - 4 recettes", oldPrice: 19.90, newPrice: 15.75 },
  { id: 10, name: "La boite Manons 240 g net - 16 Manons - 4 recettes", oldPrice: 14.70, newPrice: 10.30 },
  { id: 11, name: "La boite Rochers 250 g net - 24 rochers au praliné assortis - 4 recettes", oldPrice: 19.90, newPrice: 15.75 },
  { id: 12, name: "La boite en métal Giandujas 260 g net - 28 giandujas aux deux noisettes - 4 recettes", oldPrice: 24.30, newPrice: 19.20 },
  { id: 13, name: "La boite \"Choco'pralinés\" 280 g net - 4 recettes assorties", oldPrice: 18.80, newPrice: 14.50 },
  { id: 14, name: "La boite sujets de Noël 245 g net - 19 sujets au praliné assortis - 7 recettes", oldPrice: 17.20, newPrice: 13.00 },
  { id: 15, name: "Le coffret en bois 345 g net - 28 pralinés assortis - 17 recettes", oldPrice: 36.50, newPrice: 27.40 },
  { id: 16, name: "L'étui de 3 tablettes de chocolat au lait 240 g net", oldPrice: 13.95, newPrice: 11.15 },
  { id: 17, name: "Le sac (24 x 28 x 11 cm)", oldPrice: 0, newPrice: 0.46 },
  { id: 18, name: "La boite ours en guimauve 375 g net - 40 ours en guimauve enrobés de chocolat au lait", oldPrice: 23.00, newPrice: 17.80 },
  { id: 19, name: "La boite ours en guimauve caramel 320 g net - 20 ours en guimauve et cœur caramel enrobés de chocolat au lait", oldPrice: 23.00, newPrice: 17.80 },
  { id: 20, name: "L'étui de 3 tablettes de chocolat noir 240 g net", oldPrice: 13.95, newPrice: 11.15 },
  { id: 21, name: "La boite Juliettes 285 g net - 26 Juliettes assorties - 4 recettes", oldPrice: 24.00, newPrice: 20.30 },
  { id: 22, name: "La boite bombes de chocolat chaud 200 g net - 4 bombes Père Noël - 2 recettes", oldPrice: 15.60, newPrice: 12.90 },
  { id: 23, name: "Le sachet de 8 ours en chocolat 96 g net - Chocolat au lait, praliné et sucre pétillant", oldPrice: 6.90, newPrice: 5.50 },
  { id: 24, name: "La boite Gustaves 325g net - 24 Gustaves assortis - 4 recettes", oldPrice: 23.20, newPrice: 19.30 },
  { id: 25, name: "Amandes et noisettes au chocolat 230 g net", oldPrice: 19.90, newPrice: 15.75 },
  { id: 26, name: "Les orangettes 260 g net", oldPrice: 20.00, newPrice: 16.00 },
  { id: 27, name: "Les marrons glacés en morceaux 250 g net", oldPrice: 18.60, newPrice: 16.45 },
  { id: 28, name: "Les pâtes de fruits 250 g net - 5 saveurs assorties", oldPrice: 15.60, newPrice: 13.85 },
  { id: 29, name: "La boite Carrés 270 g net - 60 carrés - 10 saveurs assorties", oldPrice: 27.40, newPrice: 21.30 },
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
    if (!termsAccepted || calculateTotal() === "0.00" || !clientInfo.contactName || !clientInfo.address || !clientInfo.postalCode || !clientInfo.city || !clientInfo.email) {
      alert("Veuillez remplir tous les champs obligatoires et accepter les conditions générales de vente.");
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
      }
    );

    // Envoyer un email via EmailJS
    const templateParams = {
      from_name: clientInfo.contactName,
      from_email: clientInfo.email,
      company_name: clientInfo.companyName,
      address: `${clientInfo.address}, ${clientInfo.postalCode} ${clientInfo.city}`,
      phone: clientInfo.phone,
      total_amount: calculateTotal(),
      order_items: products
        .filter((product) => orderItems[product.id])
        .map((product) => ({
          name: product.name,
          quantity: orderItems[product.id],
          subtotal: calculateSubtotal(product.id, orderItems[product.id]),
        })),
    };

    emailjs
      .send(
        "service_t3c8k69",
        "template_m8cac2p",
        templateParams,
        "v1Zc07OJAYhFUkBzk"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Commande envoyée avec succès par email !");
        },
        (error) => {
          console.log(error.text);
          alert("Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.");
        }
      );

    // Confirmer la commande et afficher la pop-up de remerciement
    setOrderSubmitted(true);
  };

  if (orderSubmitted) {
    return (
      <div>
        <Confetti />
        <div>
          Merci {clientInfo.contactName} pour votre commande ! Nous vous contacterons bientôt pour confirmer les détails.
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <img src="/api/placeholder/200/100" alt="Logo Jeff de Bruges" className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Jeff de Bruges</h2>
        <p>Jeff de Bruges Plaisir - C.cial Auchan Aushopping Grand Plaisir</p>
        <p>Chemin départemental 161</p>
        <p>78370 Plaisir</p>
        <p className="text-red-600 font-bold mt-4">Commande à retourner avant le : 08/11/2024</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              name="companyName"
              placeholder="Raison sociale"
              value={clientInfo.companyName}
              onChange={handleClientInfoChange}
              required
            />
            <Input
              name="contactName"
              placeholder="Nom du contact"
              value={clientInfo.contactName}
              onChange={handleClientInfoChange}
              required
            />
            <Input
              name="address"
              placeholder="Adresse"
              value={clientInfo.address}
              onChange={handleClientInfoChange}
              required
            />
            <div className="flex space-x-4">
              <Input
                name="postalCode"
                placeholder="Code postal"
                value={clientInfo.postalCode}
                onChange={handleClientInfoChange}
                required
              />
              <Input
                name="city"
                placeholder="Ville"
                value={clientInfo.city}
                onChange={handleClientInfoChange}
                required
              />
            </div>
            <Input
              name="phone"
              placeholder="Téléphone"
              value={clientInfo.phone}
              onChange={handleClientInfoChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={clientInfo.email}
              onChange={handleClientInfoChange}
              required
            />
            <Input
              name="siret"
              placeholder="N° SIRET"
              value={clientInfo.siret}
              onChange={handleClientInfoChange}
              required
            />
            <Input
              name="tva"
              placeholder="N° TVA intra"
              value={clientInfo.tva}
              onChange={handleClientInfoChange}
            />
            <div>
              <label htmlFor="deliveryDate" className="block mb-2">Date de mise à disposition souhaitée :</label>
              <Input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                value={clientInfo.deliveryDate}
                onChange={handleClientInfoChange}
                required
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Produits</h3>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <img src={`/api/placeholder/50/50`} alt={product.name} className="mr-4" />
                  <div>
                    <p>{product.name}</p>
                    <p>
                      <span className="line-through mr-2">{product.oldPrice.toFixed(2)}€ TTC**</span>
                      <span className="font-bold">{product.newPrice.toFixed(2)}€ TTC***</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    value={orderItems[product.id] || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-20 mr-4"
                  />
                  <span className="w-24 text-right">
                    {calculateSubtotal(product.id, orderItems[product.id] || 0)}€ TTC
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <strong>Total: {calculateTotal()}€ TTC</strong>
          </div>

          <div className="mt-4">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
            />
            <label htmlFor="terms" className="ml-2">
              Oui, j'ai pris connaissance des conditions générales de vente figurant en annexe.
            </label>
          </div>

          <p className="mt-4 text-sm">
            **Les prix barrés sont les prix de vente TTC maximum en boutique.<br />
            ***Prix de vente TTC maximum. Photos non contractuelles.
          </p>
          <Button type="submit" onClick={handleSubmit} className="mt-4">Passer la commande</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="mt-4 text-xs">
          Politique des données personnelles : les informations collectées via le bon de commande font l'objet d'un traitement automatisé et/ou manuel ayant pour finalité la gestion de votre commande. Le responsable dudit traitement, est la société dont les coordonnées figurent dans l'encadré en haut du bon de commande. Vous disposez de droits quant à ces données et leur traitement qui vous sont détaillés sur le document joint au bon de commande.
        </p>
      </CardFooter>
    </Card>
  );
};

export default OrderForm;
