<script lang="ts">
    import { isCartOpen, cartItems, totalItems, subtotal, addCartItem, removeCartItem, minForFreeShipping, shippingCost, shippingTypes } from "../../cartStore";
    import { formatCurrency } from "../../utils";
    import OrderSummary from "../OrderSummary.svelte";
    import SvelteQuantity from "./SvelteQuantity.svelte";

    function toggleCart() {
        isCartOpen.set(!$isCartOpen);
        let layoutElement = document.querySelector(".layout--aside-cart");

        if ($isCartOpen) {
            layoutElement?.classList.add("drawer-open");
        } else {
            layoutElement?.classList.remove("drawer-open");
        }
    }

    function onIncrement(event:any, itemKey:any){
        let item = $cartItems[itemKey];
        addCartItem(item)
    }

    function onDecrement(event:any, itemKey:any){
        removeCartItem(itemKey)
    }

    

    let defaultShippingType = shippingTypes.find(shippingType => shippingType.default);
    let selectedShippingType;

    let handleSubmitChild:any;

    function submit(event: any) {
        handleSubmitChild(event)
    }

    let showPaymentForm = false;

    function backHandler() {
        showPaymentForm = false;
    }

    function finishPurchaseHandler() {
        showPaymentForm = true;
    }

    function handleShippingTypeChange(event:any) {
        selectedShippingType = shippingTypes.find(shippingType => shippingType.value === event.target.value);
    }   
</script>

<div 
role="button" 
tabindex="0" 
class="cart-drawer-backdrop" 
class:show={$isCartOpen}
on:click={toggleCart}>
</div>

<div class="cart-drawer" class:open={$isCartOpen}>
    <header class="cart-drawer__header">
        <div class="cart-drawer__header-content">
            {#if !showPaymentForm}
                <h3 class="cart-drawer__title">Mi carrito</h3>
            {:else}
                <button on:click={backHandler} class="cart-back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                </button>
                <h3 class="cart-drawer__title">Finalizar compra</h3>
            {/if}
        </div>
        <p class="cart-drawer__subtotal">
            <strong>Subtotal:</strong> {formatCurrency($subtotal)}
        </p>
        <button on:click={toggleCart} type="button" class="close-button" data-astro-source-loc="13:103"> <span class="absolute -inset-0.5" data-astro-source-loc="14:24"></span> <span class="sr-only" data-astro-source-loc="15:45">Close panel</span> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-astro-source-loc="16:136"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-astro-source-loc="17:26"></path> </svg> </button>
    </header>
    <div class="cart-drawer__body">
        <div class="cart-shipping-details">
            <h3 class="cart-shipping-details__title">Selecciona el tipo de envío</h3>

            <!-- <label class="cart-shipping-option" class:disabled={$minForFreeShipping - $subtotal <= 0}>
                <input disabled={$minForFreeShipping - $subtotal <= 0} name="shipping-type" value="dhl" type="radio" checked={shippingTypeSelected === 'dhl'}>
                <span>DHL - 6,50€ <small>(Entre 4 y 7 días)</small></span>
            </label> -->
            
            {#each shippingTypes as shippingType}
                <label class="cart-shipping-option" class:disabled={shippingType.freeShipping ? $minForFreeShipping - $subtotal > 0 : $minForFreeShipping - $subtotal <= 0}>
                    <input 
                    on:change={handleShippingTypeChange}
                    checked={shippingType.freeShipping && $subtotal >= $minForFreeShipping ? true  : shippingType.default}
                    disabled={shippingType.freeShipping ? $minForFreeShipping - $subtotal > 0 : $minForFreeShipping - $subtotal <= 0} 
                    name="shipping-type" 
                    value={shippingType.value} 
                    type="radio"
                    >

                    <span>
                        {shippingType.name}
                        {#if !shippingType.freeShipping}
                        - {formatCurrency(shippingType.price)}
                        {/if}

                        {#if !shippingType.freeShipping}
                        <small>(48h - 72h)</small>
                        {/if}

                        {#if $minForFreeShipping - $subtotal > 0 && shippingType.freeShipping}
                            <small>(Te faltan {formatCurrency($minForFreeShipping - $subtotal)})</small>
                        {/if}
                    </span>
                </label>
            {/each}
        
        </div>

        <div class:hidden={!showPaymentForm} class="cart-drawer-payment-form">
            <OrderSummary bind:handleSubmit={handleSubmitChild}></OrderSummary>
        </div>

        <div class="cart-drawer__items">

            {#each Object.entries($cartItems) as [key, cartItem]}
                <div class="cart-drawer__item">
                    <div class="cart-drawer__item-image">
                        <img 
                        class="h-full w-full object-cover object-center"
                        src={cartItem.imageSrc} alt={cartItem.name}
                        >
                    </div>

                    <div class="cart-drawer__item-details">
                        <h3 class="cart-drawer__item-title">
                            <a href="#">{cartItem.name}</a>
                        </h3>

                        
                        {#each cartItem.selectedAttributes as attribute}
                            <p class="cart-drawer__item-subtitle">{attribute?.option.label || attribute?.option.value}</p>
                        {/each}

                        <div class="cart-drawer__item-quantity flex items-center justify-between">
                            <SvelteQuantity on:decrement={(e) => onDecrement(e, key)} on:increment={(e) => onIncrement(e, key)} value={cartItem.quantity}></SvelteQuantity>
                            <span class="cart-drawer__item-subtitle">{formatCurrency(cartItem.quantity * cartItem.price)}</span>
                        </div>
                    </div>
                </div>
            {/each}
            <!-- More products... -->
        </div>
    </div>

        
    <footer class="cart-drawer__footer">
        {#if showPaymentForm}
            <button type="submit" class="drawer-btn cart_drawer__checkout" on:click={submit}>Realizar pago - {formatCurrency( $minForFreeShipping - $subtotal <= 0 ? $subtotal : $subtotal + $shippingCost)}</button>
        {:else}
            <button disabled={$subtotal === 0} type="button" class="drawer-btn cart_drawer__checkout" on:click={finishPurchaseHandler}>Finalizar compra</button>
        {/if}
        <button type="button" class="drawer-btn cart_drawer__continue">Continuar comprando</button>
    </footer>
</div>

<style>
    :root {
        --drawer-border: 1px solid #000;
    }

    .close-button {
        position: absolute;
        right: 0;
        color: #000;
        padding: 10px;
    }
    
    .cart-drawer {
        position: fixed;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-width: 26rem;
        width: 100%;
        background: #ffffff;
        z-index: 999;
        border-left: var(--drawer-border);
        transform: translateX(26rem);
        /* transition: transform 0.3s ease; */

        &.open {
            transform: translateX(0);
        }
    }

    .cart-drawer__header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1.5rem;
        height: 90px;
        border-bottom: 1px solid;
    }

    .cart-drawer__header-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .cart-back-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;

        & svg {
            width: 30px;
            height: 30px;
            border: 1px solid #000;
            padding: 4px;
        }
    }

    .cart-drawer__title {
        font-size: 1.4rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .cart-drawer-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;

        &.show {
            @media(max-width: 1750px) {
                opacity: 1;
                visibility: visible;
            }
        }
    }

    .cart-drawer__body {
        padding: 1.5rem 1.5rem 0;
        flex: auto;
        overflow: auto;
    }

    /* .cart-drawer__items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem;
    } */

    .cart-drawer__item {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem 0;
        border-bottom: var(--drawer-border);

        &:first-child {
            padding-top: 0;
        }
    }

    .cart-drawer__item-image {
        width: 100px;
        height: 100px;
        width: 100px;
        min-width: 100px;
        border: 1px solid;

        & img {
            object-fit: contain;
        }
    }

    .cart-drawer__item-details {
        width: calc(100% - 1.5rem - 100px);
        display: flex;
        flex-direction: column;
        padding-top: 6px;
    }

    .cart-drawer__item-title {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cart-drawer__item-subtitle {
        font-size: 0.8em;
        margin-top: 3px;
    }

    .cart-drawer__item-quantity {
        margin-top: 12px;
    }

    .cart-drawer__footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        gap: 1rem;

        & .drawer-btn {
            padding: .75rem 2rem;
            width: 100%;
            background: #fff;
            color: #000;
            border: var(--drawer-border);
            text-align: center;
        }

        & .cart_drawer__checkout {
            background: #000;
            color: #fff;
            border-color: transparent;

            &:disabled {
                cursor: not-allowed;
                opacity: 0.5;
            }
        }

        & .cart_drawer__continue {
            background: #fff;
            color: #000;
            border: var(--drawer-border);
        }
    }

    .cart-shipping-details {
        padding: 1.5rem;
        border: 1px solid;
        margin-bottom: 1.5rem;
    }

    .option-selector {
        width: 20px;
        height: 20px;
        outline: 1px solid;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &.selected::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: #000;
        }
    }

    .cart-shipping-details {

    }

    .cart-shipping-details__title {
        font-weight: 800;
        margin-bottom: 1.1rem;
        font-size: 0.78rem;
        text-transform: uppercase;
    }

    .cart-drawer__subtotal {
        font-size: 0.84rem;
        margin-top: 6px;
        text-transform: uppercase;

        & strong {
            font-size: 0.8rem;
        }
    }

    .cart-shipping-option {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 0.94em;
        margin-bottom: 10px;

        &.disabled {
            opacity: 0.4;
        }

        &:last-child {
            margin-bottom: 0;
        }

        & input {
            width: 19px;
            height: 19px;
            color: #000;
            border-radius: 0;

            &:checked {
                box-shadow: 0 0 0 4px #fff inset;
                background-image: none;
            }

            &:focus {
                --tw-ring-color: #000;
            }
        }
    }
</style>