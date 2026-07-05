# D'ARO BODY FIT — Tienda con pago Stripe

## 📁 Qué hay en esta carpeta

```
darobodyfit/
├── index.html                          → Tu tienda (la app que ya conoces)
├── gracias.html                        → Página que ve el cliente tras pagar
├── package.json                        → Dependencia de Stripe
├── netlify.toml                        → Configuración de Netlify
└── netlify/
    └── functions/
        ├── create-checkout.js          → Crea el pago en Stripe (con el total real)
        └── catalog.json                → Copia de los precios (fuente de verdad del servidor)
```

---

## 🚀 PASO A PASO PARA PONERLO ONLINE

### 1. Sube el proyecto a GitHub

1. Ve a **github.com** → crea cuenta si no tienes
2. Botón verde **"New repository"** → nómbralo `darobodyfit-tienda` → público → Create
3. Sube TODOS los archivos de esta carpeta (arrastra la carpeta entera o usa "uploading an existing file")

### 2. Conecta el repositorio a Netlify

1. Ve a **netlify.com** → inicia sesión (o crea cuenta con GitHub, es más rápido)
2. **"Add new site" → "Import an existing project"**
3. Elige GitHub → autoriza → selecciona el repositorio `darobodyfit-tienda`
4. Build settings: déjalo todo como está (ya lo configura `netlify.toml`) → **Deploy**
5. En 1-2 minutos tendrás tu link, tipo `https://random-name-123.netlify.app`
   - Puedes cambiarlo en **Site settings → Change site name** → `darobodyfit` (si está libre)

### 3. Crea tu cuenta de Stripe

1. Ve a **stripe.com** → "Comenzar ahora"
2. Regístrate con tu email
3. Puedes quedarte en **modo test** de momento (arriba a la derecha del dashboard verás un interruptor "Test mode" / "Modo de prueba")

### 4. Copia tu clave secreta de Stripe

1. En el dashboard de Stripe: **Developers → API keys** (o "Desarrolladores → Claves de API")
2. Copia la **Secret key** (empieza por `sk_test_...` en modo test)
3. ⚠️ **NUNCA la pegues en el HTML, en GitHub, ni me la mandes por chat**

### 5. Configura la clave en Netlify (de forma segura)

1. En tu sitio de Netlify: **Site configuration → Environment variables**
2. **Add a variable**:
   - Key: `STRIPE_SECRET_KEY`
   - Value: (pega aquí tu `sk_test_...`)
3. Guarda → ve a **Deploys** → **Trigger deploy → Deploy site** (para que tome la nueva variable)

### 6. ¡Pruébalo!

1. Abre tu link de Netlify desde el móvil
2. Añade productos al carrito, elige sabores
3. Pulsa "Pagar con tarjeta"
4. Te llevará a Stripe Checkout — usa esta **tarjeta de prueba** (modo test, no cobra de verdad):
   - Número: `4242 4242 4242 4242`
   - Fecha: cualquier fecha futura (ej. `12/28`)
   - CVC: cualquier 3 dígitos (ej. `123`)
5. Si todo va bien, te redirige a la página de "¡Pedido confirmado!"

### 7. Cuando quieras cobrar de verdad (modo real)

1. En Stripe, completa los datos fiscales de tu negocio (te lo pedirá cuando actives el modo real)
2. Cambia el interruptor a **modo Live** en el dashboard
3. Copia la nueva clave (empieza por `sk_live_...`)
4. Reemplaza el valor de `STRIPE_SECRET_KEY` en Netlify por la clave `sk_live_...`
5. Vuelve a hacer **Trigger deploy**

---

## 🔧 Cómo actualizar precios o productos

Los precios que se cobran realmente están en `netlify/functions/catalog.json`.
Si cambias un precio en `index.html`, **también tienes que cambiarlo aquí** para que coincida
(o pídemelo a mí y lo sincronizo en ambos sitios).

---

## 📌 Pendiente para más adelante (ya anotado)

- Imágenes y descripciones de productos en la tienda
- WhatsApp 100% automático con Twilio (de momento el cliente pulsa "enviar" manualmente)

---

Cuando tengas la cuenta de Stripe y el sitio en Netlify, avísame y seguimos con cualquier ajuste.
