<script lang="ts">
  import { nanoid } from "nanoid";
  import { isCartOpen, cartItems, totalItems, subtotal, addCartItem, removeCartItem, minForFreeShipping, shippingCost } from "../cartStore";
  import { formatCurrency } from "../utils";
  import { loadStripe } from "@stripe/stripe-js";
  import { API_URL } from "../services/ecommerce";
  import SvelteQuantity from "./ui/SvelteQuantity.svelte";
  import { onMount } from "svelte";

  export let identity: any = null;

  let elements: any;
  let stripe: any;

  let email: string;
  let address: object;
  let name: string;
  let shippingType: string = "Correos Express (48h - 72h)";

  // Fetches a payment intent and captures the client secret
  async function initialize() {
    stripe = await loadStripe(import.meta.env.PUBLIC_STRIPE_PK);

    // const appearance = {
    //   rules: {
    //     ".Label": {
    //       marginBottom: "10px",
    //       color: "#000000",
    //       fontWeight: "500",
    //       marginTop: "4px",
    //     },
    //     ".Tab": {
    //       padding: "16px",
    //       borderRadius: "10px",
    //       outline: "none",
    //     },
    //     ".Tab--selected": {
    //       backgroundColor: "#000000",
    //       border: "none",
    //       color: "#fff",
    //     },
    //     ".Tab--selected:hover": {
    //       color: "#fff",
    //     },
    //     ".Tab:focus": {
    //       boxShadow: "none",
    //     },
    //     ".Tab--selected:focus": {
    //       boxShadow: "none",
    //     },
    //     ".TabIcon--selected": {
    //       fill: "#fff",
    //     },
    //   },
    //   theme: "stripe",
    //   variables: { colorPrimary: "#000000" },
    // };

    const appearance = {
      theme: 'stripe',
      variables: {
        fontWeightNormal: '500',
        borderRadius: '0',
        colorPrimary: '#000000',
        tabIconSelectedColor: '#fff',
        gridRowSpacing: '16px',
      },
      rules: {
        '.Tab, .Input, .Block, .CheckboxInput, .CodeInput': {
          boxShadow: '0'
        },
        '.Block': {
          borderColor: 'transparent'
        },
        '.BlockDivider': {
          backgroundColor: '#ebebeb'
        },
        '.Tab, .Tab:hover, .Tab:focus': {
          border: 'none',
          boxShadow: '0 0 0 1px'
        },
        '.Tab--selected, .Tab--selected:hover': {
          backgroundColor: '#000000',
          color: '#fff'
        },
        '.Label': {
          marginBottom: '12px'
        }
      }
    };

    const options = {
      mode: "payment",
      amount: ($minForFreeShipping - $subtotal <= 0 ? $subtotal : $subtotal + $shippingCost) * 100,
      currency: "eur",
      paymentMethodCreation: "manual",
      appearance,
    };

    elements = stripe.elements(options);

    const paymentElementOptions = {
      layout: "tabs",
      paymentMethodOrder: [
        "card",
        "paypal",
        "apple_pay",
        "google_pay",
        ,
        "klarna",
      ],
    };

    const adressElementOptions = {
      mode: "shipping",
      allowedCountries: ["ES", "AN"],
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    const addressElement = elements.create("address", adressElementOptions);
    const linkAuthenticationElement = elements.create("linkAuthentication", {defaultValues: {email: identity?.email || ''}});

    // Mount the Elements to their corresponding DOM node
    paymentElement.mount("#payment-element");
    addressElement.mount("#address-element");
    linkAuthenticationElement.mount("#link-authentication-element");

    linkAuthenticationElement.on("change", (event: any) => {
      email = event.value.email;
      console.log(email);
    });

    addressElement.on("change", (event: any) => {
      if (event.complete) {
        // Extract potentially complete address
        address = event.value.address;
        name = event.value.name;
        console.log(address);
        console.log(name);
      }
    });
  }

  onMount(() => {
    initialize();
  });

  const handleError = (error: any) => {
    const messageContainer: any = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
  };

  export async function handleSubmit(event: any) {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the PaymentMethod using the details collected by the Payment Element
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name,
        },
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    console.log({ identity });

    let guestCustomerId = null;

    if (!identity || identity === null) {
      const guestCustomerIdLocalStorage = window.localStorage.getItem('guestCustomerId')

      if(guestCustomerIdLocalStorage){
        guestCustomerId = guestCustomerIdLocalStorage;
      } else {
        guestCustomerId = "guest-" + nanoid();
      }
      
    }

    // Create the PaymentIntent
    const res = await fetch(`${API_URL}/create-confirm-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: identity?.id || null,
        guestCustomerId,
        paymentMethodId: paymentMethod.id,
        items: $cartItems,
        email,
        customerName: name,
        address,
        shippingCost: $shippingCost,
        shippingType,
        subtotal: $subtotal,
        total: $minForFreeShipping - $subtotal <= 0 ? $subtotal : $subtotal + $shippingCost,
      }),
    });

    const data = await res.json();

    console.log(data);

    const { status, order } = data;

    if(order){
      if (!identity || identity === null) {
        const guestCustomerIdLocalStorage = window.localStorage.getItem('guestCustomerId')

        if(guestCustomerIdLocalStorage){

        } else {
          window.localStorage.setItem('guestCustomerId', order.guestCustomerId );
        }
        
      }
      
    }

    if (status === "succeeded") {
      window.location.href = `/finalizar-compra/pedido-recibido?key=${order.orderNumber}`;
    }

    handleServerResponse(data);
  }

  const handleServerResponse = async (response: any) => {
    if (response.error) {
      // Show error from server on payment form
    } else if (response.status === "requires_action") {
      // Use Stripe.js to handle the required next action
      const { error, paymentIntent } = await stripe.handleNextAction({
        clientSecret: response.clientSecret,
      });

      if (error) {
        // Show error from Stripe.js in payment form
      } else {
        // Actions handled, show success message
      }
    } else {
      // No actions needed, show success message
    }
  };


  function onIncrement(event:any, itemKey:any){
    let item = $cartItems[itemKey];
    addCartItem(item)
  }

  function onDecrement(event:any, itemKey:any){
    removeCartItem(itemKey)
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

<section class="order-summary">
  <div class="row">
    <form on:submit={handleSubmit} class="order-summary__form bg-white">
      <div class="stripe-element" id="payment-message" />

      <!-- <h5 class="title mb-4">Información de contacto</h5> -->

      <div class="stripe-element" id="link-authentication-element" />

      <!-- <h5 class="title mt-5 mb-4">Información de envío</h5> -->

      <div class="stripe-element" id="address-element" />

      <!-- <h5 class="title mt-5 mb-4">Detalles de pago</h5> -->

      <div class="stripe-element" id="payment-element" />

      <div id="error-message" />

      <hr class="dark horizontal" />

      <!-- <button class="btn btn-dark float-end mt-2 mb-0">
        <svg
          class="me-1"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.80039 2.80005C2.02719 2.80005 1.40039 3.42685 1.40039 4.20005V4.90005H12.6004V4.20005C12.6004 3.42685 11.9736 2.80005 11.2004 2.80005H2.80039Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.6004 6.30005H1.40039V9.80005C1.40039 10.5733 2.02719 11.2 2.80039 11.2H11.2004C11.9736 11.2 12.6004 10.5733 12.6004 9.80005V6.30005ZM2.80039 9.10005C2.80039 8.71344 3.11379 8.40005 3.50039 8.40005H4.20039C4.58699 8.40005 4.90039 8.71344 4.90039 9.10005C4.90039 9.48666 4.58699 9.80005 4.20039 9.80005H3.50039C3.11379 9.80005 2.80039 9.48666 2.80039 9.10005ZM6.30039 8.40005C5.91379 8.40005 5.60039 8.71344 5.60039 9.10005C5.60039 9.48666 5.91379 9.80005 6.30039 9.80005H7.00039C7.387 9.80005 7.70039 9.48666 7.70039 9.10005C7.70039 8.71344 7.387 8.40005 7.00039 8.40005H6.30039Z"
            fill="white"
          />
        </svg>
        Proceed to payment
      </button> -->
    </form>
  </div>
</section>

<style>
  .order-summary .row {
    flex-wrap: wrap;
  }

  @media(max-width: 1000px){
    .order-summary .row {
      flex-direction: column;
    }

    .order-summary__form {
      padding-inline:  0;
    }
  }

  @media(max-width: 550px){
    .shipping-logo {
      display: none;
      
    }

    .shipping-details {
      margin-left: 0;
    }
  }

  .stripe-element:not(:first-child){
    margin-top: 1.25rem;
  }
  .stripe-element:nth-child(2){
    margin-top: 0;
  }
</style>
