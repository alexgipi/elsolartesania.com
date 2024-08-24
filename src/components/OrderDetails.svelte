<script lang="ts">
  import { formatCurrency } from "../utils";
  import { loadStripe } from "@stripe/stripe-js";

  export let order:any = null;

  const orderItems:any = Object.values(order?.items);
  let stripe: any;

  initialize();  

  // Fetches a payment intent and captures the client secret
  async function initialize() {
    stripe = await loadStripe(import.meta.env.PUBLIC_STRIPE_PK);
    checkStatus();
  }

  // Fetches the payment intent status after payment submission
  async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    console.log(paymentIntent)

    switch (paymentIntent.status) {
      case "succeeded":
        const { receipt_email, shipping, amount, created } = paymentIntent;
        showMessage("Payment succeeded!");
        alert("Payment from " + receipt_email + " is ok. Amount: " + amount)
        break;
      case "processing":
        showMessage("Your payment is processing.");
        break;
      case "requires_payment_method":
        showMessage("Your payment was not successful, please try again.");
        break;
      default:
        showMessage("Something went wrong.");
        break;
    }
  }

  // ------- UI helpers -------

  function showMessage(messageText: string) {
    const messageContainer: any = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 4000);
  }
</script>

<section class="order-details">
    <div id="payment-message"></div>
  <ul>
    <li>
      Número del pedido: <strong>{order.orderNumber}</strong>
    </li>

    <li>
      Fecha: <strong>{order.createdAt}</strong>
    </li>

    <li>
      Email: <strong>{order.email}</strong>
    </li>

    <li>
      Total:
      <strong>
        <span class="woocommerce-Price-amount amount">
            {formatCurrency(order.total)}
        </span>
      </strong>
    </li>

    {#if order.paymentMethod === 'stripe'}
      <li>
        Método de pago: <strong>Tarjeta de crédito (Stripe)</strong>
      </li>
    {/if}

    {#if order.paymentMethod === 'paypal'}
      <li>
        Método de pago: <strong>PayPal</strong>
      </li>
    {/if}
    
  </ul>

  <h2>Detalles del pedido</h2>

  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Total</th>
      </tr>
    </thead>

    <tbody>
      {#if orderItems.length > 0}
        {#each orderItems as orderItem}
          <tr>
            <td>
              <a
                href="/saco-de-semillas-catrinas/?attribute_pa_flor-y-esencia=lavanda"
                >
                {orderItem.name}
              </a>
              <strong class="product-quantity">× {orderItem.quantity}</strong>
            </td>
    
            <td>
              <span class="woocommerce-Price-amount amount">
                {formatCurrency(orderItem.price * orderItem.quantity)}
              </span>
            </td>
          </tr>
        {/each}
      {:else}
          <p>Nada.</p>
      {/if}
      
    </tbody>

    <tfoot>
      <tr>
        <th scope="row">Subtotal:</th>
        <td>
          <span class="woocommerce-Price-amount amount">
            {formatCurrency(order.subtotal)}
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row">Envío:</th>
        <td>
          <span class="woocommerce-Price-amount amount">
           {formatCurrency(order.shippingCost)}
          </span>&nbsp;
          <small class="shipped_via">vía {order.shippingType}</small>
        </td>
      </tr>

      <tr>
        <th scope="row">Total:</th>
        <td>
          <span class="woocommerce-Price-amount amount">
            {formatCurrency(order.total)}
          </span>
        </td>
      </tr>
    </tfoot>
  </table>

  <h2>Dirección de envío</h2>

  <address>
    {order?.customerName}<br/>
    {order.shippingAddress.line1}<br/>
    {order.shippingAddress.postal_code} {order.shippingAddress.city}<br/>
    {order.shippingAddress.state}, {order.shippingAddress.country} 
    <!-- <p class="woocommerce-customer-details--phone">
      603483709
    </p> -->
    <p class="woocommerce-customer-details--email">
      {order.email}
    </p>
  </address>
</section>

<style>

.order-details {
  margin-top: 4rem;
}
h2 {
  color: #000000;
    font-size: 1.5em;
    margin: 1rem 0;
    font-weight: 500;
}
  ul {
    padding: 0 18px;
    margin-bottom: 1rem;
    position: relative;
    margin: 0 0 30px;
    background: #ffffff;
    border: 1px solid;
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #000000;
  }

  li {
    list-style: none;
  }

  th {
    text-align: left;
    color: #000000;
  }


  table {
    width: 100%;
    background: #ffffff;
    padding: 50px;
    border: 1px solid #000;
    border-collapse: initial;
  }

  table tr {
    height: 40px;
  }

  table a {
    color: #000000;
    text-decoration: underline;
  }
</style>
