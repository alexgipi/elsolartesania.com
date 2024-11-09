<script>
  import { UPLOADS_URL } from '../services/ecommerce';
  export let product;

  let position = 0;
</script>

<div class="gallery">
  {#each product?.images || [] as image, index}
    <input id={'gallery-' + (index + 1)} type="radio" name="position" bind:group={position} value={index} checked={index === 0} />
  {/each}

  <!-- dotted-bg (fondo de  cuadicula) -->
  <div class="gallery-content"> 
    <div class="flex" transition:name={product?.slug} style="overflow: hidden; border-radius: 20px;">
      <div class="gallery-items flex" style="--position: {position}">
        {#each product?.images || [] as image, index}
          <div class="flex gallery-item">
            <img
              class="product-image"
              src={UPLOADS_URL + image?.file}
              width="636"
              height="500"
              alt={`Imagen ${index + 1} del producto ${product?.name}`}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!--
  <div class="gallery-nav">
    {#each images as image, index}
      <label class="flex" for={'gallery-' + (index + 1)}>
        <img
          src={UPLOADS_URL + image?.file}
          alt={"Miniatura de la imagen " + (index + 1)}
        />
      </label>
    {/each}
  </div>
  -->
</div>

<style>
  @keyframes slidein {
    from {
      transform: translateX(calc(-100% * var(--position)));
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }

  input[type="radio"] {
    accent-color: #000;
    cursor: pointer;
    width: 20px;
    height: 20px;
    display: none;
  }

  input:nth-of-type(1):checked ~ .gallery-content .gallery-items {
    --position: 0;
  }
  input:nth-of-type(1):checked ~ .gallery-nav label:nth-child(1) img {
    opacity: 1;
  }

  input:nth-of-type(2):checked ~ .gallery-content .gallery-items {
    --position: 1;
  }
  input:nth-of-type(2):checked ~ .gallery-nav label:nth-child(2) img {
    opacity: 1;
  }

  input:nth-of-type(3):checked ~ .gallery-content .gallery-items {
    --position: 2;
  }
  input:nth-of-type(3):checked ~ .gallery-nav label:nth-child(3) img {
    opacity: 1;
  }

  input:nth-of-type(4):checked ~ .gallery-content .gallery-items {
    --position: 3;
  }
  input:nth-of-type(4):checked ~ .gallery-nav label:nth-child(4) img {
    opacity: 1;
  }

  input:nth-of-type(5):checked ~ .gallery-content .gallery-items {
    --position: 4;
  }
  input:nth-of-type(5):checked ~ .gallery-nav label:nth-child(5) img {
    opacity: 1;
  }

  .gallery {
    flex: 1;
  }

  .gallery-content {
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    padding: 1.5rem;
  }

  .gallery-content.dotted-bg {
    overflow: hidden;
    border: none;
    --dot-bg: #00000014;
    --dot-color: #00000000;
    --dot-size: 11px;
    --dot-space: 12px;
    background: linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space), linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space), var(--dot-color);
    border-radius: 0;
    & .product-image {
      filter: drop-shadow(7px 5px 8px rgba(0, 0, 0, 0.3));
    }
  }

  .gallery-items {
    --position: 0;
    transition: all 0.6s ease;
    transform: translateX(calc(-100% * var(--position)));
  }

  .gallery-item {
    min-width: 100%;
  }

  .product-image {
    object-fit: contain;
    width: 100%;
    aspect-ratio: 1 / 1;
    filter: drop-shadow(-4px 19px 10px rgba(0, 0, 0, 0.33));
  }

  .gallery-nav {
    display: grid;
    gap: 16px;
    width: 100%;
    grid-template-columns: repeat(4, 1fr);
  }

  .gallery-nav img {
    object-fit: cover;
    border-radius: 8px;
    object-position: center;
    cursor: pointer;
    opacity: 0.5;
    background-color: #eee;
  }

  .gallery-nav img.active {
    opacity: 1;
  }
</style>
