import './CheckoutSteps.css';

export default function CheckoutSteps(props) {
  return (
    <div className="checkout-steps">
      <div className={`step ${props.step1 ? 'active' : ''}`}>Sign In</div>
      <div className={`step ${props.step2 ? 'active' : ''}`}>Adresse</div>
      <div className={`step ${props.step3 ? 'active' : ''}`}>Méthode de paiement</div>
      <div className={`step ${props.step4 ? 'active' : ''}`}>Passer la commande</div>
    </div>
  );
}