<script>
    import { API_URL, UPLOADS_URL } from "../../services/ecommerce"
    import { formatCurrency } from "../../utils";
    import Gallery from "../Gallery.svelte";
    import Purchase from "../Purchase.svelte";

    export let product;

    console.log(API_URL)

    let originalImages = [...(product?.images || [])];

    function onAttributeChange(e) {
        const {attribute, option} = e.detail;

        console.log({attribute, option})

        const optionProductVariationImages = option?.['product-variation-images'] || [];
        if( optionProductVariationImages.length > 0 ) {
            product.images = optionProductVariationImages
            console.log(product)
        } else {
            product.images = originalImages
        }
        
    }
</script>

<section 
class="jumbotron-hero bg-center bg-no-repeat"
> 
    <div class="container py-4 flex flex-col gap-16 md:flex-row">
        <div class="flex flex-col flex-1 gap-6">
            <h1 class="jumbotron-title text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-5xl">
                {product.name}
            </h1>

            <span class="product-price"> {formatCurrency(product.price)}</span>
            
            {#if product.short_description}
                <div class="jumbotron-content">
                    {@html product?.short_description}
                </div>
            {/if}


            <Purchase on:attributeChange={(e) => onAttributeChange(e)} product={product}></Purchase>

        
            <!-- <div class="slider-navigation">
                <span class="active"></span>
                <span></span>
                <span></span>
                <span></span>
            </div> -->
        </div>
        
        <div class="jumbotron-item-featured-block flex-1">
            <Gallery product={product} />
        </div>
    </div>
</section>


<style>
    .jumbotron-hero {
        padding: 5rem 0;
        min-height: calc(60vh - 100px);
        align-items: center;
        display: flex;
        position: relative;
        background-size: cover;
        background-color: #ffffff;
    }

    :global(.jumbotron-content) {
        & p {
            font-size: 16px;
            color: #000;
            max-width: 740px;
            text-wrap: pretty;
            margin-bottom: 1rem;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .jumbotron-hero.with-bg {
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #1e0d34ab;
        }
    }

    .jumbotron-hero__bg-video {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .jumbotron-title {
        text-wrap: balance;
        line-height: 1.2;
        max-width: 1140px;
        color: #000;
        text-transform: uppercase;
        font-weight: 900;
        font-size: 3.8rem;

        @media(max-width: 1320px){
            font-size: 3.4rem;
        }

        @media(max-width: 1260px){
            font-size: 3rem;
        }

        @media(max-width: 1140px){
            font-size: 2.8rem;
        }

        @media(max-width: 1050px){
            font-size: 2.5rem;
        }
    }


    .jumbotron-button {
        padding: 16px 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 0.75rem;
    }

    .jumbotron-button--primary {
        background: #111;
        backdrop-filter: blur(4px);
        color: #fff;
        font-weight: 600;
    }

    .jumbotron-button--secondary {
        background: #fff;
        color: #231534;
        font-weight: 600;
        padding: 16px 32px;
    }

    .slider-navigation {
        margin-top: 1rem;
        height: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .slider-navigation span {
        min-width: 36px;
        height: 10px;
        background: #dadada;
        border-radius: 10px;
        cursor: pointer;
        transition: min-width 0.2s ease-in-out, background 0.2s ease-in-out;

        &.active {
            background: #111;
            min-width: 60px;
        }

        &:not(.active):hover {
            background: #888;
            min-width: 50px;
        }
    }

    .slider-controls {
        display: flex;
        gap: 8px;
        margin-bottom: 0;
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .slider-controls-btn {
        width: 42px;
        height: 42px;
        padding: 12px;
        background: #fff;
        border: 1px solid #919191;
        border-radius: 12px;
        color: #212121;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slider-controls-btn.prev {
        transform: scaleX(-1);
    }

    .slider-controls-btn-icon {
        width: 24px;
        height: 24px;
    }

    .jumbotron-item-featured-block {
        display: flex;
        position: relative;
    }

    .item-featured-principal-image {
        transition: all 0.6s ease;
        filter: drop-shadow(4px 3px 4px rgba(0, 0, 0, 0.3));
    }

    .item-featured-decoration-shape {
        filter: drop-shadow(4px 3px 4px rgba(0, 0, 0, 0.3));
        position: absolute;
        bottom: 82px;
        right: -7px;
        transform: rotate(47deg);
        transition: all 0.6s ease;
    }

    .jumbotron-item-featured-block:hover {
        & .item-featured-principal-image {
            transform: scale(1.1);
        }

        & .item-featured-decoration-shape {
            transform: rotate(34deg) translate(13px, 12px);
        }
    }

    .product-price {
        font-size: 1.6em;
        color: #111;
    }

</style>
