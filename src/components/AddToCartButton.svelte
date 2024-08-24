<script lang="ts">
  import { createEventDispatcher } from "svelte";
    import { addCartItem } from "../cartStore";
    import { UPLOADS_URL } from "../services/ecommerce";
  
    export let product: any;
    export let quantity: number = 1;
    export let size: 'small' | 'large' = 'large';
    export let buttonType: 'circle' | 'square' = 'square';
    export let disabledProp:boolean = false;
    export let selectedAttributesOptions:any = []

    const dispatch = createEventDispatcher()

    const hardcodedItemInfo:any = {
      id: product?._id,
      name: product?.name,
      price: product?.price,
      selectedAttributes: selectedAttributesOptions
    };

    if(product?.images){
      hardcodedItemInfo.imageSrc = UPLOADS_URL + product.images[0]?.file;
    }

    function addToCartHandle(e:any) {
      e.stopPropagation();
      e.preventDefault();
      addCartItem(hardcodedItemInfo, quantity);
      addedToCartAlert();
      
      dispatch('addedToCart', {hardcodedItemInfo, quantity})
    }
  
    let showAddedToCartAlert = false;

    function addedToCartAlert(miliseconds: number = 1500) {
      showAddedToCartAlert = true;
      disabledProp = true;
  
      setTimeout(() => {
        showAddedToCartAlert = false;
        disabledProp = false;
      }, miliseconds);
    }
</script>

{#if buttonType === 'circle'}
  <button 
  on:click={addToCartHandle}
  class="circle-add-to-cart-button">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style="fill: currentColor;" class="s-bB7RB7E7chM_"><path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" class="s-bB7RB7E7chM_"></path></svg>
  </button>
{:else}
    {#if size === 'small'}
      <button 
        on:click={addToCartHandle} 
        class="text-white w-full bg-[#111] font-medium rounded-xl text-sm px-5 py-3 text-center"
        class:bg-green={showAddedToCartAlert}
        disabled={disabledProp}
        >
        {#if showAddedToCartAlert}
            Añadido al carrito
        {:else}
            Añadir al carrito
        {/if}
      </button>
    {:else}
      <button
          on:click={addToCartHandle}
          type="submit"
          id="add-to-cart"
          class="btn"
          class:btn-add-to-cart={size === 'large'}
          class:with-icon={size === 'large'}
          class:bg-green={showAddedToCartAlert}
          disabled={disabledProp}
      >
          {#if showAddedToCartAlert}
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
              Producto añadido al carrito
          {:else}
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style="fill: currentColor;"><path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"></path></svg>
              Añadir producto al carrito
          {/if}
      </button>
    {/if}
{/if}



<style>

  .circle-add-to-cart-button {
    padding: 1.5rem;
    background: #ffffff;
    color: #000;
    border: 1px solid;
    transition: backgrond 0.3s ease, color 0.3s ease;
  }

  .btn-add-to-cart {
    color: #000;
    background-color: #ffffff;
    font-size: 0.96em;
    border-radius: 0;
    min-width: 260px;
    justify-content: center;
    flex: auto;
    padding: 16px 32px;
    border: 1px solid;
    transition: all 0.3s ease;
  }

  .btn-add-to-cart:hover:not(.bg-green) {
      background: #000;
      color: #fff;
      border-color: transparent;
  }

  .btn-add-to-cart--small {
    padding: 9px 20px;
    display: flex;
    gap: 12px;
    background: #f8f3fe;
    border-radius: 8px;
    margin-top: 16px;
    color: #3d1a6c;
    width: 100%;
    justify-content: center;
  }

  .btn-add-to-cart--small svg {
    fill: currentColor;
    width: 20px;
    height: 20px;
  }

  .bg-green {
    background-color: #18946b;
    color: #fff;
  }

  button:disabled {
    cursor: not-allowed;
  }
</style>