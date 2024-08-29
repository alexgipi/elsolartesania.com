import { atom, map } from 'nanostores';
import { UPLOADS_URL } from './services/ecommerce';

export const isCartOpen = atom(false);

export type CartItem = {
  id: string;
  name: string;
  imageSrc: string;
  price: number;
  selectedAttributes: any[];
  quantity: number;
}

export const cartItems = map<Record<string, CartItem>>({});
export const totalItems = atom(0);
export const subtotal = atom(0);
export const minForFreeShipping = atom(45);
export const shippingCost = atom(8.5);
export const clickContinueShoppingCount = atom(0);

export let shippingTypes = [
  {
      value: 'correos-express',
      name: 'Correos Express',
      label: 'Correos Express (48h - 72h)',
      shippingTime: 'Entrega entre 48h y 72h ',
      price: 8.5,
      freeShipping: false,
      default: true,
  },
  {
      value: 'free-shipping',
      name: 'Envío gratuito',
      label: 'Envío gratuito',
      shippingTime: 'Entrega entre 48 y 72 horas',
      price: 0,
      freeShipping: true,
      minForEnable: 45,
      default: false,
  },

];


type ItemDisplayInfo = Pick<CartItem, 'id' | 'name' | 'imageSrc' | 'price' | 'selectedAttributes'>;

export function addCartItem({ id, name, imageSrc, price, selectedAttributes }: ItemDisplayInfo, quantity: number = 1) {
  const key = name + ' - ' + getSelectedOptionsString(selectedAttributes);
  const existingEntry = cartItems.get()[key];

  totalItems.set(totalItems.get() + quantity);
  subtotal.set(subtotal.get() + price * quantity);

  const newSelectedAttributes = Object.values(selectedAttributes).map((attr) => {
    const productVariationImages = attr.option?.['product-variation-images'];
    if(productVariationImages && productVariationImages.length > 0) {
      imageSrc = UPLOADS_URL + productVariationImages[0].file;
    }
    return { ...attr };
  }); // Crear nuevas instancias

  if (existingEntry) {
    const updateItemData = {
      ...existingEntry,
      quantity: existingEntry.quantity + quantity,
      selectedAttributes: newSelectedAttributes,
    };

    cartItems.setKey(key, updateItemData);
  } else {
    const newItemData = { id, name, imageSrc, price, quantity, selectedAttributes: newSelectedAttributes };
    cartItems.setKey(key, newItemData);
  }

  if(!isCartOpen.get()){
    isCartOpen.set(true);

    let layoutElement = document.querySelector(".layout--aside-cart");
    layoutElement?.classList.add("drawer-open");

  }
}


export function removeCartItem(key:any) {
  const existingEntry = cartItems.get()[key];

  if (!existingEntry) {
    // Si el elemento no existe en el carrito, no hay nada que hacer
    return;
  }

  const updatedQuantity = existingEntry.quantity - 1;

  if (updatedQuantity <= 0) {
    // Si la cantidad actual es menor o igual a cero, eliminamos el elemento del carrito
    cartItems.setKey(key, undefined!)
  } else {
    // Actualizamos la cantidad y el subtotal
    const updatedItemData = {
      ...existingEntry,
      quantity: updatedQuantity,
    };

    cartItems.setKey(key, updatedItemData);
  }

  // Actualizamos el total de elementos y el subtotal
  totalItems.set(totalItems.get() - 1);
  subtotal.set(subtotal.get() - existingEntry.price);
}

function getSelectedOptionsString(selectedAttributes:any) {
  let selectedOptionsString = '';
  
  Object.values(selectedAttributes).forEach((attr:any, index:any) => {
    selectedOptionsString += attr.viewValue + ': ' + attr.option.value;
    
    if (index < selectedAttributes.length - 1) {
      selectedOptionsString += ' | ';
    }
  });

  return selectedOptionsString;
}