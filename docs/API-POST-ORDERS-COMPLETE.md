# API: POST /api/orders

## Información General

* **Endpoint:** POST /api/orders
* **Módulo:** Orders (Gestión de Órdenes)
* **Versión:** 1.0
* **Descripción:** Crea una nueva orden de compra. Valida cliente, dirección, items y stock. Procesa transaccionalmente: inserta cliente, dirección, orden e items, decrementa stock e inserta registros de auditoría.

---

## Objetivo de Negocio

Permite a clientes **completar el proceso de compra** en la tienda. Este endpoint es el núcleo del flujo de transacción:

1. **Captura de datos del cliente:** Nombre, email, teléfono
2. **Captura de dirección de envío:** Completa con validación regional
3. **Validación de disponibilidad:** Confirma stock antes de procesar
4. **Generación de orden:** Crea registro transaccional
5. **Cálculo de totales:** Aplica impuestos locales
6. **Reserva de inventario:** Decrementa stock atomicamente

**Valor comercial:**
- Convierte visitantes en clientes
- Genera ingresos
- Captura datos para análisis
- Valida disponibilidad de productos

---

## Requisitos Previos

### Validaciones
- ✅ Email debe cumplir formato RFC 5322 (ej: usuario@dominio.com)
- ✅ Nombre no puede estar vacío
- ✅ Teléfono es opcional pero si se proporciona debe ser válido
- ✅ Dirección completa requerida (calle, ciudad, país)
- ✅ Al menos 1 item en el carrito
- ✅ Cantidad por item debe ser > 0
- ✅ Producto debe existir
- ✅ Stock disponible >= cantidad solicitada

### Permisos
- ✅ **Autenticación:** No requerida (endpoint público)
- ✅ **Rol:** Cualquiera (público)
- ✅ **Rate Limit:** 10 requests/minuto por IP

### Dependencias
- ✅ Base de datos MySQL disponible
- ✅ Tabla `products` con stock actualizado
- ✅ Transacciones ACID soportadas

---

## Request

### Headers

| Header | Valor | Requerido | Descripción |
|--------|-------|-----------|------------|
| Content-Type | application/json | SÍ | Indica formato JSON |
| User-Agent | cualquiera | NO | Identificador del cliente |
| X-Request-ID | uuid | NO | Correlation ID para tracing |

**Ejemplo de Headers:**
```
POST /api/orders HTTP/1.1
Content-Type: application/json
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

### Parámetros de Ruta (Path Params)

No aplica (endpoint raíz de recurso).

### Query Params

No aplica (todo en body).

### Body (Request)

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "514-555-0100",
  "address": {
	"street": "123 Rue Sainte-Catherine",
	"city": "Montreal",
	"state": "Quebec",
	"zipCode": "H3B 1A1",
	"country": "Canada"
  },
  "items": [
	{
	  "productId": 1,
	  "quantity": 2,
	  "unitPrice": 89.99
	},
	{
	  "productId": 3,
	  "quantity": 1,
	  "unitPrice": 45.50
	}
  ]
}
```

### Definición de Campos (Request)

| Campo | Tipo | Requerido | Validaciones | Descripción |
|-------|------|-----------|-------------|------------|
| **name** | string | SÍ | min: 1, max: 100, trim, no SQL injection | Nombre completo del cliente |
| **email** | string | SÍ | max: 255, formato email RFC5322, unique en BD | Email del cliente (para contacto y confirmación) |
| **phone** | string | NO | max: 20, formato telefónico | Teléfono para entrega (opcional) |
| **address** | object | SÍ | - | Dirección de envío (completa) |
| **address.street** | string | SÍ | min: 5, max: 255, no SQL injection | Calle y número |
| **address.city** | string | SÍ | min: 2, max: 100 | Ciudad |
| **address.state** | string | NO | max: 50 | Estado/Provincia (opcional) |
| **address.zipCode** | string | NO | max: 20 | Código postal (opcional) |
| **address.country** | string | SÍ | min: 2, max: 100, ISO 3166 | País en formato ISO (ej: CA, US) |
| **items** | array | SÍ | min: 1, max: 100 items | Lista de productos a comprar |
| **items[].productId** | integer | SÍ | > 0, debe existir en BD | ID del producto |
| **items[].quantity** | integer | SÍ | min: 1, max: 1000 | Cantidad del producto |
| **items[].unitPrice** | decimal | SÍ | min: 0.01, max: 999999.99 | Precio unitario del producto (para auditoría) |

---

## Flujo de Procesamiento

Paso a paso qué ocurre internamente desde que se recibe la petición:

```
1. [5ms] RECEPCIÓN & VALIDACIÓN INICIAL
   ├─ Parsear JSON
   ├─ Validar Content-Type = application/json
   └─ Validar estructura básica

2. [10ms] VALIDACIONES DE CAMPOS
   ├─ name: presente, no vacío, max 100
   ├─ email: formato válido, max 255
   ├─ phone: opcional, si existe validar formato
   ├─ address: objeto presente
   ├─ address.street: presente, min 5, max 255
   ├─ address.city: presente, min 2, max 100
   ├─ address.country: presente, código ISO válido
   └─ items: array, min 1 elemento

3. [8ms] VALIDACIONES DE SEGURIDAD
   ├─ Detectar SQL injection en strings
   ├─ Detectar XSS en campos de texto
   ├─ Validar no contiene caracteres prohibidos
   └─ Rate limit check: 10 req/min por IP

4. [15ms] VALIDACIONES DE ITEMS
   ├─ Iterar cada item en array
   ├─ productId: entero > 0
   ├─ quantity: entero, min 1, max 1000
   ├─ unitPrice: decimal, min 0.01
   └─ Validar no vacíos

5. [25ms] CONSULTAS A BASE DE DATOS (Inicio Transacción)
   ├─ BEGIN TRANSACTION
   ├─ Para cada item:
   │  ├─ SELECT stock FROM products WHERE id = productId
   │  ├─ Validar stock >= quantity solicitada
   │  └─ Si insuficiente: ROLLBACK, error 422
   └─ Consulta exitosa: stock confirmado

6. [20ms] VALIDACIÓN EMAIL ÚNICO
   ├─ SELECT COUNT(*) FROM customers WHERE email = ?
   ├─ Si resultado > 0: email ya existe en sistema
   └─ Validar si se permite duplicado o se reutiliza cliente

7. [15ms] INSERCIONES EN BD
   ├─ INSERT INTO customers (name, email, phone)
   │  └─ Obtener customer_id (LAST_INSERT_ID)
   ├─ INSERT INTO addresses (customer_id, street, city, state, zip_code, country)
   │  └─ Obtener address_id
   ├─ INSERT INTO orders (customer_id, address_id, subtotal, tax, total, status)
   │  └─ Obtener order_id
   └─ Para cada item:
	  ├─ INSERT INTO order_items (order_id, product_id, quantity, unit_price)
	  └─ Obtener order_item_id

8. [30ms] DECREMENTAR STOCK
   ├─ Para cada item:
   ├─ UPDATE products SET stock = stock - quantity WHERE id = productId
   ├─ Validar filas afectadas = 1
   └─ Si error: ROLLBACK, error 500

9. [20ms] CÁLCULO DE TOTALES
   ├─ Sumar subtotal: SUM(quantity * unit_price) para todos items
   ├─ Calcular impuesto: subtotal * 0.15 (15% fijo)
   ├─ Calcular total: subtotal + impuesto
   └─ Actualizar en orden si es necesario

10. [10ms] AUDITORÍA & LOGS
	├─ INSERT INTO audit_log (order_id, action, timestamp, ip)
	├─ Log nivel INFO: "Order created"
	├─ Log nivel DEBUG: customer_id, items count, total
	└─ Generar X-Request-ID único

11. [5ms] COMMIT TRANSACCIÓN
	├─ COMMIT (todas las inserciones atómicas)
	├─ Si error: ROLLBACK automático
	└─ Liberar locks en BD

12. [10ms] FORMATEAR RESPUESTA
	├─ Construir JSON response
	├─ Incluir orderId, subtotal, tax, total, status
	└─ Generar timestamp

13. [5ms] HEADERS DE RESPONSE
	├─ Content-Type: application/json
	├─ X-Request-ID: (el mismo recibido)
	├─ X-Order-ID: (para tracking)
	└─ Cache-Control: no-cache (datos transaccionales)

14. [2ms] ENVIAR RESPONSE
	└─ HTTP 201 Created + JSON body

═════════════════════════════════════════════════════════
TIEMPO TOTAL ESPERADO: 160-180ms
```

---

## Response Exitosa

### Código HTTP

**201 Created** - Orden creada exitosamente

### Headers de Response

```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 150
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-Order-ID: 7
Cache-Control: no-cache
Date: Mon, 28 May 2026 10:30:00 GMT
```

### Body de Response

```json
{
  "orderId": 7,
  "customerId": 123,
  "status": "pending",
  "subtotal": 225.48,
  "tax": 33.82,
  "total": 259.30,
  "createdAt": "2026-05-28T10:30:00Z",
  "estimatedDelivery": "2026-06-04T10:30:00Z"
}
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|------------|
| **orderId** | integer | ID único de la orden (generado por BD) |
| **customerId** | integer | ID del cliente creado o existente |
| **status** | string | Estado inicial de la orden: "pending" |
| **subtotal** | decimal | Suma de (cantidad × precio) para todos items |
| **tax** | decimal | Impuesto calculado (15% del subtotal) |
| **total** | decimal | subtotal + tax (monto final) |
| **createdAt** | string (ISO8601) | Timestamp de creación en UTC (ej: 2026-05-28T10:30:00Z) |
| **estimatedDelivery** | string (ISO8601) | Fecha estimada de entrega (7 días después) |

---

## Errores

### Error 400: Validación de Campos

**Código de Error:** `INVALID_REQUEST`

**Descripción:** Los campos del request no cumplen validaciones.

**Causas:** Email inválido, nombre vacío, cantidad negativa, campo faltante, etc.

**Ejemplo:**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "INVALID_REQUEST",
  "message": "Validation failed",
  "details": {
	"email": "Invalid email format",
	"items[0].quantity": "Must be greater than 0"
  }
}
```

---

### Error 400: Email Duplicado

**Código de Error:** `EMAIL_ALREADY_EXISTS`

**Descripción:** El email ya está registrado en el sistema.

**Solución Recomendada:** Usar email diferente o verificar si cliente ya tiene órdenes.

**Ejemplo:**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "Email jane@example.com is already registered",
  "email": "jane@example.com"
}
```

---

### Error 422: Stock Insuficiente

**Código de Error:** `INSUFFICIENT_STOCK`

**Descripción:** No hay stock suficiente para uno o más productos.

**Solución Recomendada:** Reducir cantidad o esperar reabastecimiento.

**Ejemplo:**
```json
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "INSUFFICIENT_STOCK",
  "message": "Insufficient stock for product",
  "product": {
	"productId": 1,
	"productName": "Vintage Leather Jacket",
	"requested": 5,
	"available": 3
  }
}
```

---

### Error 404: Producto No Encontrado

**Código de Error:** `PRODUCT_NOT_FOUND`

**Descripción:** Uno de los products en items no existe.

**Solución Recomendada:** Verificar ID de producto, actualizar desde GET /products.

**Ejemplo:**
```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product 999 not found",
  "productId": 999
}
```

---

### Error 429: Rate Limit

**Código de Error:** `RATE_LIMIT_EXCEEDED`

**Descripción:** Demasiadas órdenes desde esta IP en tiempo corto.

**Límite:** 10 órdenes por minuto por dirección IP.

**Ejemplo:**
```json
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60

{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests from your IP",
  "retryAfter": 60
}
```

---

### Error 500: Error Interno

**Código de Error:** `INTERNAL_SERVER_ERROR`

**Descripción:** Error no controlado en el servidor.

**Causas Comunes:** BD desconectada, transacción falló, error en cálculo.

**Ejemplo:**
```json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Reglas de Negocio

### Email Único Globalmente
- ✅ Cada email **debe ser único** en la tabla customers
- ✅ Validación en BD con UNIQUE constraint
- ✅ Previene múltiples cuentas por mismo email
- ✅ Si cliente reintenta: error 400 (EMAIL_ALREADY_EXISTS)

### Stock Mínimo
- ✅ Stock **nunca puede ser negativo**
- ✅ Validar stock >= cantidad ANTES de actualizar
- ✅ Usar transacción para atomicidad: si fail en stock, rollback todo
- ✅ Si insuficiente: error 422 (INSUFFICIENT_STOCK)

### Cálculo de Impuestos
- ✅ **Impuesto = Subtotal × 0.15** (15% fijo)
- ✅ Redondeado a 2 decimales
- ✅ No se aplican impuestos adicionales
- ✅ Total = Subtotal + Impuesto

### Estado Inicial
- ✅ Toda orden comienza en estado **"pending"**
- ✅ Solo admin puede cambiar estado después
- ✅ Transiciones: pending → confirmed → shipped → delivered
- ✅ Estado no puede regresionar (no volver a pending)

### Validación Regional
- ✅ Campo "country" es ISO 3166 (CA, US, MX, etc.)
- ✅ Si country = CA: "state" debe ser provincia válida (ON, QC, BC, etc.)
- ✅ State es opcional para otros países
- ✅ zipCode: formato opcional (no validar estrictamente)

### Datos de Auditoría
- ✅ Registrar IP del cliente
- ✅ Registrar timestamp de creación
- ✅ Registrar user-agent (si disponible)
- ✅ Generar X-Request-ID único para tracing

---

## Dependencias

### Servicios Internos

| Servicio | Función | Archivo |
|----------|---------|---------|
| **validateEmail** | Valida formato email RFC5322 | `backend/src/utils/validators.js` |
| **validateAddress** | Valida estructura y región de dirección | `backend/src/utils/validators.js` |
| **calculateTax** | Calcula impuestos (subtotal × 0.15) | `backend/src/services/orderService.js` |
| **createOrder** | Orquesta creación transaccional | `backend/src/services/orderService.js` |
| **decrementStock** | Actualiza stock en BD | `backend/src/services/inventoryService.js` |

### Base de Datos

| Tabla | Operación | Descripción |
|-------|-----------|------------|
| **customers** | INSERT | Crea nuevo cliente |
| **addresses** | INSERT | Crea dirección de envío |
| **orders** | INSERT, SELECT | Crea orden y obtiene ID |
| **order_items** | INSERT | Crea registros de items |
| **products** | SELECT, UPDATE | Lee stock, decrementa cantidad |
| **audit_log** | INSERT | Registra auditoría |

### Transacción ACID

```sql
START TRANSACTION;

-- Validar stock disponible (SELECT FOR UPDATE lock)
SELECT stock FROM products WHERE id = ? FOR UPDATE;

-- Insertar registros
INSERT INTO customers (name, email, phone) VALUES (?, ?, ?);
INSERT INTO orders (customer_id, ...) VALUES (...);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (...);

-- Decrementar stock
UPDATE products SET stock = stock - ? WHERE id = ?;

-- Registrar auditoría
INSERT INTO audit_log (...) VALUES (...);

COMMIT;
-- Si error: ROLLBACK automático
```

### APIs/Servicios Externos

- ❌ Ninguno (sistema standalone por ahora)
- ⏳ Futuro: integraciones con Payment Gateway, Email Service, SMS Notifications

---

## Casos de Uso

### Caso 1: Cliente Realiza Compra Exitosa

**Actor:** Cliente final  
**Flujo:**

```
1. Cliente navega HomePage → ve 3 productos
2. Cliente hace GET /products → obtiene catálogo
3. Cliente selecciona 2 jackets (producto 1, cantidad 2)
4. Cliente agrega a carrito (en localStorage)
5. Cliente hace GET /products/1 → verifica detalles
6. Cliente va a checkout
7. Cliente ingresa datos:
   - Nombre: Jane Doe
   - Email: jane@example.com
   - Teléfono: 514-555-0100
   - Dirección: 123 Rue Sainte-Catherine, Montreal, QC, Canada
8. Cliente hace POST /api/orders con:
   {
	 "name": "Jane Doe",
	 "email": "jane@example.com",
	 "items": [{ "productId": 1, "quantity": 2, "unitPrice": 89.99 }],
	 ...
   }
9. Backend responde HTTP 201:
   {
	 "orderId": 7,
	 "total": 206.98
   }
10. Frontend muestra ConfirmationPage
11. Cliente puede consultar estado en GET /api/orders/7 (si es admin)
```

**Resultado:** ✅ Orden 7 creada, stock decrementado de 5 → 3

---

### Caso 2: Stock Insuficiente

**Actor:** Cliente intentando comprar más que stock disponible  
**Flujo:**

```
1. Cliente intenta: POST /api/orders
   - productId: 1 (stock actual: 2)
   - quantity: 5 (solicita más que disponible)

2. Backend:
   - BEGIN TRANSACTION
   - SELECT stock FROM products WHERE id = 1
   - Valida 5 > 2 (insuficiente)
   - ROLLBACK

3. Backend responde HTTP 422:
   {
	 "error": "INSUFFICIENT_STOCK",
	 "product": {
	   "productId": 1,
	   "requested": 5,
	   "available": 2
	 }
   }

4. Frontend muestra error: "Solo hay 2 unidades disponibles"
```

**Resultado:** ❌ Orden NO creada, stock intacto

---

### Caso 3: Email Duplicado

**Actor:** Cliente intenta crear orden con email registrado anteriormente  
**Flujo:**

```
1. Cliente 1 hizo: POST /api/orders (email: jane@ex.com) → OK
2. Cliente 2 intenta: POST /api/orders (email: jane@ex.com)

3. Backend valida email único:
   - SELECT COUNT(*) FROM customers WHERE email = 'jane@ex.com'
   - Resultado: 1 (existe)
   - Error

4. Backend responde HTTP 400:
   {
	 "error": "EMAIL_ALREADY_EXISTS",
	 "message": "Email jane@ex.com already registered"
   }

5. Frontend muestra: "Este email ya tiene cuenta, use otro"
```

**Resultado:** ❌ Orden NO creada, datos intactos

---

### Caso 4: Rate Limit Excedido

**Actor:** Bot o atacante intentando múltiples órdenes  
**Flujo:**

```
1. Mismo cliente (IP: 192.168.1.100) intenta 11 órdenes en 1 minuto
2. Backend contador: 10 órdenes → OK, 11ava → BLOQUEADA
3. Backend responde HTTP 429:
   {
	 "error": "RATE_LIMIT_EXCEEDED",
	 "retryAfter": 60
   }
```

**Resultado:** ⏳ Esperar 60 segundos, luego reintentar

---

## Consideraciones de Seguridad

### Autenticación
- ✅ **Tipo:** No requerida (endpoint público)
- ✅ **Justificación:** Clientes anónimos deben poder comprar
- ✅ **Riesgo:** Mitigado con rate limiting y validaciones

### Autorización
- ✅ **Nivel:** Cualquier usuario puede crear orden para sí mismo
- ✅ **Validación:** No se verifica usuario ID (endpoint sin login)
- ✅ **Riesgo:** Bajo (datos validados antes de insertar)

### Validación de Entrada (OWASP Top 10)

| Vulnerabilidad | Mitigation |
|----------------|-----------|
| **SQL Injection** | Prepared statements, parameterized queries |
| **XSS** | Sanitizar strings, no usar innerHTML |
| **CSRF** | Token CSRF en formulario HTML (no aplica para API) |
| **Command Injection** | No ejecutar comandos del SO |
| **Path Traversal** | No aplica (no hay file uploads) |
| **XXE** | No parsear XML externo |
| **Broken Auth** | Endpoint público, rate limit activo |
| **Sensitive Data** | No loguear contraseñas, emails encriptados |
| **XML External Entity** | No aplica (usando JSON) |
| **Access Control** | Verificar customer_id coincide con token (futuro) |

### Protección de Datos Sensibles

```javascript
// ❌ NUNCA logguear:
- Contraseñas
- Números de tarjeta de crédito
- Tokens JWT completos

// ✅ SÍ logguear:
- Email (truncado: jane***@example.com)
- Monto de orden (no datos de pago)
- Timestamp, IP, User-Agent
- Resultado de validación (PASS/FAIL)
```

### Rate Limiting

```
Límite: 10 órdenes por minuto por dirección IP
Implementación: Middleware en express
Clave: IP + endpoint
Timeout: 60 segundos después de exceder
```

### CORS

```javascript
// Permitir solo cliente frontend
CORS: {
  origin: ['http://localhost:5173', 'https://shop.vintagedago.com'],
  credentials: false,
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
}
```

### Timeout de Requests

```
Timeout general: 30 segundos
Timeout de transacción: 5 segundos
Si timeout: respuesta 504 (Gateway Timeout)
```

---

## Observabilidad

### Logs Generados

#### Nivel INFO (Eventos normales)
```
[2026-05-28 10:30:00.123] INFO: POST /api/orders received from 192.168.1.100
[2026-05-28 10:30:00.245] INFO: Order 7 created successfully for jane@example.com
[2026-05-28 10:30:00.300] INFO: Stock decremented: product 1 (5 → 3)
```

#### Nivel DEBUG (Detalles técnicos)
```
[2026-05-28 10:30:00.050] DEBUG: Request validation passed
[2026-05-28 10:30:00.075] DEBUG: Email format validated: jane@example.com
[2026-05-28 10:30:00.100] DEBUG: Stock check: product 1 has 5 units (requested 2)
[2026-05-28 10:30:00.150] DEBUG: Transaction started (TX-ID: tx-12345)
[2026-05-28 10:30:00.200] DEBUG: Customer inserted with ID 123
[2026-05-28 10:30:00.220] DEBUG: Order inserted with ID 7
[2026-05-28 10:30:00.240] DEBUG: Stock updated
[2026-05-28 10:30:00.290] DEBUG: Transaction committed
```

#### Nivel ERROR (Problemas)
```
[2026-05-28 10:30:15.500] ERROR: Insufficient stock for product 1
[2026-05-28 10:30:45.100] ERROR: Database connection lost, transaction rolled back
[2026-05-28 10:31:00.200] ERROR: Email already exists: jane@example.com
```

### Métricas

| Métrica | Valor | Unidad | Umbral Alerta |
|---------|-------|--------|--------------|
| Orders/min | 5-10 | ordenes/minuto | > 100 (posible ataque) |
| Tiempo promedio | 170 | ms | > 500 (lento) |
| Tasa de error 4xx | 2-5 | % | > 20 (muchas validaciones fallando) |
| Tasa de error 5xx | 0-1 | % | > 5 (problemas del servidor) |
| Stock insuficiente | varies | % | N/A (negocio normal) |
| Duplicado email | 1-2 | % | > 10 (patrón sospechoso) |
| Rate limit hits | varies | events/min | > 5 (bloqueos activos) |

### Trazabilidad & Correlation IDs

```javascript
// Header recibido:
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000

// Incluido en TODOS los logs de esta transacción:
[REQ-ID: 550e8400-e29b-41d4-a716-446655440000] ...

// Incluido en response:
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-Order-ID: 7

// En BD (audit_log):
INSERT INTO audit_log (request_id, order_id, ...) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 7, ...)
```

---

## Instrucciones para IA

### Cuándo Usar Este Endpoint

✅ **USAR CUANDO:**
- Usuario ha confirmado compra (click en botón "Comprar")
- Tienes datos completos: nombre, email, dirección, items
- Stock se ha verificado (GET /products/:id antes)
- Rate limit no ha sido excedido
- Red está disponible y servidor accesible

❌ **NO USAR CUANDO:**
- Usuario aún está browsing (pre-compra)
- Faltan datos (ej: email sin validar)
- Stock desconocido (no hiciste GET /products/:id)
- Has hecho > 10 órdenes en el último minuto
- Intentas duplicar email sin propósito

### Validaciones Obligatorias (Antes de POST)

```javascript
// Antes de hacer POST /api/orders, verificar:

1. Email válido:
   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
   if (!isValidEmail) throw new Error("Email inválido")

2. Nombre no vacío:
   if (!name || name.trim().length === 0) throw new Error("Nombre requerido")

3. Items no vacío:
   if (!items || items.length === 0) throw new Error("No hay items")

4. Dirección completa:
   const { street, city, country } = address
   if (!street || !city || !country) throw new Error("Dirección incompleta")

5. Stock disponible (verificado antes):
   const product = await GET /products/1
   if (product.stock < requestedQuantity) throw new Error("Stock insuficiente")

6. Rate limit OK:
   if (requestCountThisMinute >= 10) throw new Error("Rate limit")
```

### Orden Correcto en un Flujo

```
FLUJO CORRECTO (A SEGUIR):

1. GET /api/products
   └─ Obtener catálogo disponible

2. GET /api/products/:id (para cada producto)
   └─ Verificar stock y detalles

3. [VALIDAR LOCALMENTE en cliente]
   └─ Email, nombre, dirección, cantidades

4. POST /api/orders
   └─ Crear orden (atómico)

5. [ESPERAR 201 Created]
   └─ Si 201: orden creada, ver confirmación
   └─ Si 400/422: error, mostrar al usuario
   └─ Si 500: error servidor, reintentar

6. [FUTURO] GET /api/orders/:id (si admin)
   └─ Ver estado de orden
```

### Posibles Reintentos

```javascript
// SÍ reintentar (idempotent-safe):
- 500 Internal Server Error → reintentar después 2-5 segundos
- 503 Service Unavailable → reintentar con backoff exponencial
- Timeout de red → reintentar una vez

// NO reintentar (cambiaría resultado):
- 400 Bad Request → datos inválidos, no van a pasar en reintento
- 404 Not Found → producto no existe, no va a aparecer
- 422 Unprocessable Entity → regla de negocio fallida (stock, email)
- 429 Rate Limited → esperar Retry-After segundos, luego reintentar UNA VEZ

// Implementación:
const MAX_RETRIES = 3
let attempt = 0
while (attempt < MAX_RETRIES) {
  try {
	return await POST /api/orders
  } catch (error) {
	if ([500, 503].includes(error.status)) {
	  const delay = Math.pow(2, attempt) * 1000 // backoff exponencial
	  await sleep(delay)
	  attempt++
	} else {
	  throw error // no reintentar otros errores
	}
  }
}
```

### Manejo de Errores

```javascript
// Estructura de manejo:

try {
  const response = await POST /api/orders(orderData)

  if (response.status === 201) {
	// ✅ Éxito
	console.log("Orden creada:", response.data.orderId)
	showConfirmation(response.data)

  } else if (response.status === 400) {
	// ❌ Datos inválidos
	console.error("Error 400:", response.data)
	if (response.data.error === "EMAIL_ALREADY_EXISTS") {
	  show("Este email ya está registrado")
	} else if (response.data.error === "INVALID_REQUEST") {
	  show("Datos inválidos: " + response.data.details)
	}

  } else if (response.status === 422) {
	// ❌ Regla de negocio
	console.error("Error 422:", response.data)
	if (response.data.error === "INSUFFICIENT_STOCK") {
	  show(`Solo hay ${response.data.product.available} disponibles`)
	}

  } else if (response.status === 429) {
	// ❌ Rate limit
	const retryAfter = response.headers['Retry-After']
	show(`Espera ${retryAfter} segundos`)

  } else if (response.status === 500) {
	// ❌ Error servidor (reintentar)
	console.error("Error 500, reintentando...")
	await sleep(2000)
	return retry()
  }

} catch (networkError) {
  console.error("Error de red:", networkError)
  show("Problema de conexión, reintentando...")
  await sleep(1000)
  return retry()
}
```

### Idempotencia

⚠️ **IMPORTANTE:** POST /api/orders **NO ES IDEMPOTENTE**

```
Cada llamada POST crea una NUEVA orden.

❌ PROBLEMA:
POST /api/orders → Crea orden 7
[Network timeout]
POST /api/orders (reintento) → Crea orden 8
[Resultado: 2 órdenes en lugar de 1]

✅ SOLUCIÓN:
1. Implementar Idempotency-Key en cliente:
   POST /api/orders
   Headers: { Idempotency-Key: uuid-único }

2. Backend con Idempotency-Key:
   - Primera llamada: crea orden, guarda Idempotency-Key
   - Segunda llamada (misma Key): retorna orden anterior
   - Previene duplicados

3. Alternativa cliente-side:
   - POST /api/orders
   - Si timeout: esperar 5 segundos
   - GET /api/orders?email=... → verificar si existe
   - Si existe: usar esa orden (no recriar)
   - Si no existe: reintentar POST
```

---

## Ejemplo Completo

### Request Completo

```http
POST /api/orders HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
Content-Length: 450
User-Agent: PostmanRuntime/7.32.3

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "514-555-0100",
  "address": {
	"street": "123 Rue Sainte-Catherine",
	"city": "Montreal",
	"state": "Quebec",
	"zipCode": "H3B 1A1",
	"country": "Canada"
  },
  "items": [
	{
	  "productId": 1,
	  "quantity": 2,
	  "unitPrice": 89.99
	},
	{
	  "productId": 3,
	  "quantity": 1,
	  "unitPrice": 45.50
	}
  ]
}
```

### Procesamiento en Backend (Con Timeline)

```
┌─ T=0ms ─────────────────────────────────────────────────────────────
│ Request recibido desde 192.168.1.100
│
├─ T=5ms ──────────────────────────────────────────────────────────
│ Parsing JSON ✅
│ Content-Type validation ✅
│
├─ T=15ms ─────────────────────────────────────────────────────────
│ Email format validation: jane@example.com ✅
│ Name not empty: "Jane Doe" ✅
│ Phone format: "514-555-0100" ✅
│ Address complete ✅
│ Items array present ✅
│
├─ T=25ms ─────────────────────────────────────────────────────────
│ Security checks:
│ - SQL injection detection ✅
│ - XSS detection ✅
│ - Rate limit: 1/10 this minute ✅
│
├─ T=40ms ─────────────────────────────────────────────────────────
│ BEGIN TRANSACTION
│
├─ T=65ms ─────────────────────────────────────────────────────────
│ Product stock validation:
│ - Product 1: requested 2, available 5 ✅
│ - Product 3: requested 1, available 8 ✅
│
├─ T=80ms ─────────────────────────────────────────────────────────
│ Email uniqueness check:
│ SELECT COUNT(*) FROM customers WHERE email = 'jane@example.com'
│ Result: 0 (new email) ✅
│
├─ T=95ms ─────────────────────────────────────────────────────────
│ INSERT INTO customers:
│ id=123, name='Jane Doe', email='jane@example.com', phone='514-555-0100'
│ ✅ Inserted (auto-id: 123)
│
├─ T=110ms ────────────────────────────────────────────────────────
│ INSERT INTO addresses:
│ customer_id=123, street='123 Rue Sainte-Catherine', city='Montreal', ...
│ ✅ Inserted (auto-id: 45)
│
├─ T=125ms ────────────────────────────────────────────────────────
│ Subtotal calculation:
│ Item 1: 2 × 89.99 = 179.98
│ Item 3: 1 × 45.50 = 45.50
│ Subtotal = 225.48
│
├─ T=130ms ────────────────────────────────────────────────────────
│ Tax calculation:
│ Tax = 225.48 × 0.15 = 33.82
│
├─ T=135ms ────────────────────────────────────────────────────────
│ INSERT INTO orders:
│ id=7, customer_id=123, address_id=45, subtotal=225.48, tax=33.82, 
│ total=259.30, status='pending', created_at='2026-05-28T10:30:00.135Z'
│ ✅ Inserted (auto-id: 7)
│
├─ T=150ms ────────────────────────────────────────────────────────
│ INSERT INTO order_items (2 rows):
│ Row 1: order_id=7, product_id=1, quantity=2, unit_price=89.99
│ Row 2: order_id=7, product_id=3, quantity=1, unit_price=45.50
│ ✅ Inserted
│
├─ T=165ms ────────────────────────────────────────────────────────
│ UPDATE products (decrement stock):
│ Product 1: UPDATE SET stock = 5-2 = 3 ✅
│ Product 3: UPDATE SET stock = 8-1 = 7 ✅
│
├─ T=180ms ────────────────────────────────────────────────────────
│ INSERT INTO audit_log:
│ request_id='550e8400-e29b-41d4-a716-446655440000'
│ order_id=7, action='ORDER_CREATED', ip='192.168.1.100'
│ ✅ Inserted
│
├─ T=185ms ────────────────────────────────────────────────────────
│ COMMIT TRANSACTION ✅
│ All changes saved atomically
│
├─ T=190ms ────────────────────────────────────────────────────────
│ Response formatting
│ JSON body constructed
│
└─ T=195ms ────────────────────────────────────────────────────────
  HTTP 201 Created response sent
```

### Response Completo

```http
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 180
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-Order-ID: 7
Cache-Control: no-cache
Date: Mon, 28 May 2026 10:30:00 GMT

{
  "orderId": 7,
  "customerId": 123,
  "status": "pending",
  "subtotal": 225.48,
  "tax": 33.82,
  "total": 259.30,
  "createdAt": "2026-05-28T10:30:00.135Z",
  "estimatedDelivery": "2026-06-04T10:30:00.135Z"
}
```

### Logs Completos

```
[2026-05-28 10:30:00.000] REQ-ID: 550e8400-e29b-41d4-a716-446655440000
[2026-05-28 10:30:00.000] INFO: POST /api/orders received from 192.168.1.100
[2026-05-28 10:30:00.005] DEBUG: JSON parsing completed
[2026-05-28 10:30:00.015] DEBUG: Email format validated: jane@example.com
[2026-05-28 10:30:00.020] DEBUG: Address validation passed
[2026-05-28 10:30:00.025] DEBUG: Security checks passed (no injection detected)
[2026-05-28 10:30:00.030] DEBUG: Rate limit check: 1/10 this minute ✅
[2026-05-28 10:30:00.040] DEBUG: Transaction started (TX-ID: tx-123456)
[2026-05-28 10:30:00.065] DEBUG: Stock validation - Product 1: 5 >= 2 ✅
[2026-05-28 10:30:00.070] DEBUG: Stock validation - Product 3: 8 >= 1 ✅
[2026-05-28 10:30:00.080] DEBUG: Email uniqueness check: 0 results (new email) ✅
[2026-05-28 10:30:00.095] DEBUG: Customer 123 inserted
[2026-05-28 10:30:00.110] DEBUG: Address 45 inserted
[2026-05-28 10:30:00.130] DEBUG: Order 7 inserted
[2026-05-28 10:30:00.150] DEBUG: Order items inserted (2 rows)
[2026-05-28 10:30:00.165] DEBUG: Stock decremented - Product 1: 5 → 3
[2026-05-28 10:30:00.170] DEBUG: Stock decremented - Product 3: 8 → 7
[2026-05-28 10:30:00.180] DEBUG: Audit log entry created
[2026-05-28 10:30:00.185] DEBUG: Transaction committed
[2026-05-28 10:30:00.195] INFO: Order 7 created successfully for jane@example.com
[2026-05-28 10:30:00.195] INFO: Subtotal: 225.48, Tax: 33.82, Total: 259.30
[2026-05-28 10:30:00.195] INFO: Response sent (HTTP 201, 195ms)
```

### Métricas Generadas

```
Endpoint: POST /api/orders
Timestamp: 2026-05-28T10:30:00Z
Status: 201 (success)
Duration: 195ms
CustomerID: 123
OrderID: 7
OrderTotal: 259.30
ItemCount: 2
IP: 192.168.1.100
UserAgent: PostmanRuntime/7.32.3
RequestID: 550e8400-e29b-41d4-a716-446655440000

Percentiles:
p50: 170ms (median)
p95: 200ms (95% under 200ms)
p99: 250ms (99% under 250ms)

Rate: 5 orders/min current
Success Rate: 97.3% (3 errors en último minuto)
```

---

## Resumen

Este documento define completamente el endpoint `POST /api/orders` incluyendo:

✅ Información técnica completa  
✅ Objetivo y valor de negocio  
✅ Request y response schemas con validaciones  
✅ Flujo de procesamiento paso a paso  
✅ Manejo exhaustivo de errores  
✅ Reglas de negocio claras  
✅ Dependencias y funciones llamadas  
✅ Casos de uso reales  
✅ Consideraciones de seguridad  
✅ Observabilidad completa (logs, métricas, tracing)  
✅ Instrucciones detalladas para agentes IA  
✅ Ejemplo end-to-end con timeline  

Este nivel de detalle permite:
- 👤 Humanos: Entender completamente cómo funciona
- 🤖 IA: Usar el endpoint correctamente sin errores
- 📊 Analistas: Entender valor de negocio
- 🔒 Seguridad: Validar protecciones
- 🚀 DevOps: Monitorear y alertar
