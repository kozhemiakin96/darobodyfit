// netlify/functions/create-checkout.js
//
// Esta función recibe el carrito del cliente (productos + sabores + cantidades),
// calcula el total REAL en el servidor (con el 10% de descuento ya aplicado)
// y crea una sesión de pago en Stripe Checkout.
//
// IMPORTANTE: el total se recalcula aquí, en el servidor, usando los precios
// oficiales del catálogo — nunca se confía en el precio que manda el navegador.
// Esto evita que alguien manipule el precio desde el navegador antes de pagar.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ── CATÁLOGO OFICIAL (fuente de verdad de precios) ──────────────────────────
// Debe mantenerse igual que el PRODUCTS del HTML. Si añades/cambias un
// producto en la tienda, actualiza también aquí el id y el pvp.
const PRODUCTS = require('./catalog.json');

const DISCOUNT = 0.10; // 10% de descuento para clientes del gimnasio

exports.handler = async (event) => {
  // Solo aceptamos POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cart, clientName } = JSON.parse(event.body);

    if (!Array.isArray(cart) || cart.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El carrito está vacío' }),
      };
    }
    if (!clientName || !clientName.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Falta el nombre del cliente' }),
      };
    }

    // Construimos las líneas de Stripe usando SIEMPRE el precio del catálogo
    // del servidor (nunca el que venga del navegador).
    const line_items = cart.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.id}`);
      }
      const discountedPrice = +(product.pvp * (1 - DISCOUNT)).toFixed(2);
      const unitAmountCents = Math.round(discountedPrice * 100);

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${product.name} — ${item.flavor}`,
            description: `D'ARO BODY FIT · 10% descuento aplicado`,
          },
          unit_amount: unitAmountCents,
        },
        quantity: item.qty,
      };
    });

    const origin = event.headers.origin || event.headers.referer || 'https://darobodyfit.netlify.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?pago=cancelado`,
      metadata: {
        clientName: clientName.trim(),
        // Guardamos el carrito resumido en metadata para poder reconstruir
        // el pedido después (por ejemplo, para el WhatsApp o el webhook).
        cartSummary: cart
          .map((i) => `${i.id}:${i.flavor}:${i.qty}`)
          .join('|')
          .slice(0, 490), // Stripe limita metadata a 500 chars por campo
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Error creando sesión de Stripe:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' }),
    };
  }
};
