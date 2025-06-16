<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { UPLOADS_URL } from "../services/ecommerce";
  import AddToCartButton from "./AddToCartButton.svelte";
  import SvelteQuantity from "./ui/SvelteQuantity.svelte";

  export let product: any;;
  let qty = 1;

  const dispatch = createEventDispatcher()


  interface selectedAttributesOption {
    slug: string;
    viewValue: string;
    option: any;
  }

  let selectedAttributesOptions:any = {}


  function handleAttributeChange(e: any, attribute: any) {
    // console.log(attribute)
    // console.log(e.target.value)
    // selectedAttributesOptions[attribute.slug] = {
    //     slug: attribute.slug,
    //     viewValue: attribute.name,
    //     optionSelected: e.target.value
    // }

    // const index = selectedAttributesOptions.findIndex((el) => {
    //   return el.slug === attribute.slug;
    // });

    // if (index === -1) {
    //   selectedAttributesOptions.push({
    //     slug: attribute.slug,
    //     viewValue: attribute.name,
    //     optionSelected: e.target.value,
    //   });
    //   console.log(selectedAttributesOptions);
    // } else {
    //   selectedAttributesOptions[index].optionSelected = e.target.value;
    //   console.log(selectedAttributesOptions);
    // }
  }

  function handleImageAttributeChange(option: any, attribute: any) {
    const exists = selectedAttributesOptions[attribute.slug]
    if (exists) {
      selectedAttributesOptions[attribute.slug].option = option;
    } else {
      selectedAttributesOptions[attribute.slug] = {
        slug: attribute.slug,
        viewValue: attribute.name,
        option: option,
      }
    }

    console.log(option)
    dispatch('attributeChange', {attribute, option})
  }

  function onAddedToCart(e:any){
    console.log(e.detail)
    resetQuantity()
  }

  function resetQuantity(){
    qty = 1
  }
  
</script>

<div class="w-full">
  <div class="flex flex-col items-start gap-8">
    {#if product.attributes &&  product?.attributes?.length > 0}
      {#each product?.attributes as attribute, attributeIndex}
        
          {#if attribute.options}
            <div class="inline-flex flex-col items-start gap-2 w-full">
                {#if attribute.label }
                    <label for={attribute.slug}>{attribute.label || attribute.name}:</label>
                {/if}

                {#if attribute.type === "selection"}
                    <select
                        id={attribute.slug}
                        on:change={(e) => handleAttributeChange(e, attribute)}
                        name={attribute.slug}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option selected disabled
                        >{attribute.label ||
                            attribute.name ||
                            "Selecciona una opción"}</option
                        >

                        {#each attribute.options as option, optionIndex}
                        <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                {:else if attribute.type === "image"}
                    <ul
                        role="radiogroup"
                        aria-label={attribute?.slug}
                        class="variable-items-wrapper image-variable-items-wrapper flex gap-2"
                    >
                        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                        {#each attribute.options as option, optionIndex}
                          {#if !option.disable_attribute}
                              <li
                                  class:active={option.value === selectedAttributesOptions?.[attribute.slug]?.option.value}
                                  on:click={() => handleImageAttributeChange(option, attribute)}
                                  aria-checked="false"
                                  tabindex="0"
                                  class="variable-item image-variable-item image-variable-item-cajita-1"
                                  title={option.label}
                                  data-tooltip={option.label}
                                  data-label={option.label}
                                  data-value={option.value}
                                  role="radio"
                                  data-tooltip-out-of-stock=""
                              >
                                  <div class="variable-item-contents">
                                      <img
                                          class="variable-item-image"
                                          aria-hidden="true"
                                          alt="Cajita 1"
                                          src={UPLOADS_URL + 'thumbnail/' + option?.['attribute-option-image']?.file}
                                          width="200"
                                          height="200"
                                      />
                                  </div>
                              </li>
                          {/if}
                        {/each}
                    </ul>
                {:else if attribute.type === "color"}
                    <ul
                        role="radiogroup"
                        aria-label={attribute?.slug}
                        class="variable-items-wrapper image-variable-items-wrapper flex gap-2"
                    >
                        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                        {#each attribute.options as option, optionIndex}
                          {#if !option.disable_attribute}
                              <li
                                  class:active={option.value === selectedAttributesOptions?.[attribute.slug]?.option.value}
                                  on:click={() => handleImageAttributeChange(option, attribute)}
                                  aria-checked="false"
                                  tabindex="0"
                                  class="variable-item image-variable-item image-variable-item-cajita-1"
                                  title={option.label}
                                  data-tooltip={option.label}
                                  data-label={option.label}
                                  data-value={option.value}
                                  role="radio"
                                  data-tooltip-out-of-stock=""
                              >
                                  <div class="variable-item-contents">
                                    {#if option?.['attribute-option-image']?.file}
                                      <img
                                          class="variable-item-image"
                                          aria-hidden="true"
                                          alt="Cajita 1"
                                          src={UPLOADS_URL + 'thumbnail/' + option?.['attribute-option-image']?.file}
                                          width="200"
                                          height="200"
                                      />
                                    {:else}
                                      <div class="variable-item-color" style="background-color: {option.attribute_option_color}"></div>
                                    {/if}
                                  </div>
                              </li>
                          {/if}
                        {/each}
                    </ul>
                {/if}
            </div>
          {/if}
        
      {/each}
    {/if}

    <SvelteQuantity bind:value={qty} min={1} max={100} name="quantity" />
  </div>

  <div class="flex product-actions gap-2.5 mt-8">
    <AddToCartButton
      on:addedToCart={(e) => onAddedToCart(e)}
      {selectedAttributesOptions}
      disabledProp={false}
      {product}
      quantity={qty}
    ></AddToCartButton>
  </div>
</div>

<style>
  :root {
    --variable-item-radius: 100%;
  }

  .variable-items-wrapper {
    display: grid;
    gap: 12px;
    width: 100%;
    grid-template-columns: repeat(5,1fr);

    @media(min-width: 406px) {
      grid-template-columns: repeat(6,1fr);
    }

    @media(min-width: 498px) {
      grid-template-columns: repeat(7,1fr);
    }

    @media(min-width: 585px) {
      grid-template-columns: repeat(8,1fr);
    }

    @media(min-width: 710px) {
      grid-template-columns: repeat(9,1fr);
    }

    @media(min-width: 768px) {
      grid-template-columns: repeat(6,1fr);
    }

    @media(min-width: 920px) {
      grid-template-columns: repeat(7,1fr);
    }

    @media(min-width: 1182px) {
      grid-template-columns: repeat(8,1fr);
    }

    @media(min-width: 1329px) {
      grid-template-columns: repeat(9,1fr);
    }
  }

  .variable-item.image-variable-item {
    border-radius: var(--variable-item-radius);
    overflow: hidden;
    cursor: pointer;
    outline: 2px solid #c9c9c987;
    padding: 2px;

    &.active {
      outline: 2px solid #111;
    }
  }

  .variable-item-image {
    border-radius: var(--variable-item-radius);
    aspect-ratio: 1;
    object-fit: contain;
  }

  .variable-item-color {
    aspect-ratio: 1;
    border-radius: var(--variable-item-radius);
  }
</style>
