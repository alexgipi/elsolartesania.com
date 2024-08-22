<script lang="ts">
  import { nanoid } from "nanoid";
  import { cartItems, subtotal, addCartItem, removeCartItem } from "../cartStore";
  import { formatCurrency } from "../utils";
  import { loadStripe } from "@stripe/stripe-js";
  import { API_URL } from "../services/ecommerce";
  import SvelteQuantity from "./ui/SvelteQuantity.svelte";

  export let identity: any = null;

  let elements: any;
  let stripe: any;

  let email: string;
  let address: object;
  let name: string;
  let shippingType: string = "Correos Express (24h - 48h)";
  let shippingCost = 8.5;


  initialize();
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
      amount: ($subtotal + shippingCost) * 100,
      currency: "eur",
      paymentMethodCreation: "manual",
      // Fully customizable with appearance API.
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

  const handleError = (error: any) => {
    const messageContainer: any = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
  };

  async function handleSubmit(event: any) {
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
        shippingCost,
        shippingType,
        subtotal: $subtotal,
        total: $subtotal + shippingCost,
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
    <div class="order-summary__overview bg-dark bg-gradient rounded-end">
      <p class="text-white opacity-6 mb-0">Total</p>
      <h3 class="text-white mb-4">{formatCurrency($subtotal > 0 ? $subtotal + shippingCost : 0)}</h3>

      {#if Object.values($cartItems).length}
        {#each Object.entries($cartItems) as [key, cartItem]}
          <div class="order-summary__item d-flex mb-4">
            <img
              width="120"
              class="w-20 rounded-2"
              src={cartItem.imageSrc}
              alt={cartItem.name}
            />
            <div class="flex-auto pl-4 pr-4">
              <h6 class="text-lg text-white mt-1 mb-1">{cartItem.name}</h6>
              <p class="mb-0 text-white opacity-8">
                {formatCurrency(cartItem.price)} x {cartItem.quantity}
                {cartItem.quantity === 1 ? "Unidad" : "Unidades"}
              </p>
              <p class="mt-1 mb-1 text-sm text-white opacity-6">Small</p>
            </div>
            <div class="text-end">
              <p class="text-white mb-0">
                {formatCurrency(cartItem.price * cartItem.quantity)}
              </p>
              <div class="flex justify-center">
                <SvelteQuantity on:decrement={(e) => onDecrement(e, key)} on:increment={(e) => onIncrement(e, key)} value={cartItem.quantity}></SvelteQuantity>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <p
          class="opacity-6 text-sm"
          style="
            padding: 12px 22px;
            background: #fcfcfc26;
            border-radius: 5px;
            "
        >
          No tienes productos en el carrito
        </p>
      {/if}

      <ul class="list-unstyled">
        <li class="mt-2">
          <div class="d-flex justify-content-between">
            <p class="opacity-8 text-white">Subtotal</p>
            <p class="fw-bold opacity-8 text-white">
              {formatCurrency($subtotal)}
            </p>
          </div>
        </li>

        <li class="border-bottom mt-2">
          <div class="d-flex justify-content-between">
            <p class="opacity-8 text-white">
              IVA <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="This may vary depending on the country you are in"
                data-container="body"
                data-animation="true"
                ><i
                  class="fas fa-question-circle text-sm"
                  aria-hidden="true"
                /></span
              >
            </p>
            <p class="fw-bold opacity-8 text-white">Incluido</p>
          </div>
        </li>

        <li class="mt-2">
          <div class="d-flex justify-content-between">
            <p class="opacity-8 text-white">
              Envío <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="More information related to shipping"
                data-container="body"
                data-animation="true"
                ><i
                  class="fas fa-question-circle text-sm"
                  aria-hidden="true"
                /></span
              >
            </p>
            <p class="fw-bold opacity-8 text-white">{formatCurrency(8.5)}</p>
          </div>

          <form class="mt-5 grid gap-6">
            <div class="relative">
              <input class="peer hidden" id="radio_1" type="radio" checked name="shippingType"/>
              <span class="peer-checked:border-[#9c75cf] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label class="peer-checked:border-2 peer-checked:border-[#9c75cf] peer-checked:bg-[#cba6ff12] flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" for="radio_1">
                <img 
                class="shipping-logo w-[75px] object-contain" 
                src="https://www.correosexpress.com/chx-portal62-theme/images/logo_correos_expressv1.png" alt="" 
                style="filter:grayscale(100);"
                />
                <div class="ml-5 shipping-details">
                  <span class="text-[#fff] peer-checked:text-[#9c75cf] mt-2 font-semibold">Correos Expréss - 8,50 €</span>
                  <p class="text-[#ffffff82] text-sm leading-6">Entrega: 2 - 4 Días</p>
                </div>
              </label>
            </div>
            <!-- <div class="relative opacity-[0.3]">
              <input disabled class="peer hidden" id="radio_2" type="radio" name="shippingType"/>
              <span class="peer-checked:border-[#9c75cf] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label for="radio_2" class="peer-disabled:cursor-not-allowed peer-checked:border-2 peer-checked:border-[#9c75cf] peer-checked:bg-[#cba6ff12] flex cursor-pointer select-none rounded-lg border border-gray-300 p-4">
                <img 
                class="w-[75px] object-contain" 
                src="/envio-gratis.png" alt="" 
                style="filter: invert(1) sepia(1) grayscale(1);"
                />
                <div class="ml-5">
                  <span class="text-[#fff] peer-checked:text-[#9c75cf] mt-2 font-semibold">Envío gratuito</span>
                  <p class="text-[#ffffff82] text-sm leading-6">Faltan 25,50 € para activar el envío gratuito</p>
                </div>
              </label>
            </div> -->
          </form>
        </li>

        <li class="mt-4">
          <div class="d-flex justify-content-between">
            <h4 class="text-white">Total</h4>
            <h4 class="text-white">{formatCurrency($subtotal > 0 ? $subtotal + shippingCost : 0)}</h4>
          </div>
        </li>
      </ul>
    </div>
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

      <button class="btn btn-dark float-end mt-2 mb-0">
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
      </button>
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
    margin-bottom: 1.25rem;
  }
</style>
