<!-- ---
interface Props {
  min?: number;
  max?: number;
  name?: string;
  value?: number
}

const { min, max, name, value } = Astro.props;
--- -->
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let min = 0;
    export let max:number | null = null;
    export let name:string | undefined = undefined;
    export let value:string | number | undefined = min;
    let inputEl:any;

    function increment(){
        let number = parseInt(inputEl.value);
        
        if(max){
            if(number < max) {
                value = number + 1;
            }
        } else {
            value = number + 1;
        }

        inputEl.value = value;

        dispatch('increment', { value })
    }

    function decrement(){
        let number = parseInt(inputEl.value);

        if(number > min) {
            value = number - 1;
        }

        inputEl.value = value;
        
        dispatch('decrement', { value })
    }

    function handleInput(){
        let number = parseInt(inputEl.value);

        if(number < min) {
            inputEl.value = min;
        }

        if(max && number > max){
            inputEl.value = max;
        }

        
    }

</script>

<div class="quantity-selector relative flex items-center">
    <button class="quantity-selector-btn decrement-btn" on:click={decrement} type="button" id="decrement-button">
        <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
        </svg>
    </button>

    <input
    on:input={handleInput}
    bind:value={value}
    min={min}
    max={max}
    name={name}
    type="number"
    bind:this={inputEl}
    id="product-quantity" 
    class="quantity-selector-input" 
    placeholder="" 
    required
    >
    
    <button class="quantity-selector-btn increment-btn" on:click={increment} type="button" id="increment-button">
        <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
        </svg>
    </button>
</div>

<style>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    .quantity-selector {
        border: 1px solid;
    }


    .quantity-selector-input {
        max-width: 44px;
        padding: 3px;
        text-align: center;
        border: none;
        box-shadow: none;
        border-inline: 1px solid;
        font-size: 0.9em;
   }

    .quantity-selector-btn {
        padding: 10px;
    }
</style>

