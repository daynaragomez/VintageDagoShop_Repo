# 🎨 Guías de Componentes - VintageDagoShop

Esta guía define cómo crear y estructurar componentes en el proyecto.

## Principios de Componentes

1. Single Responsibility: Un componente hace una cosa
2. Reutilizable: Puede usarse en múltiples lugares
3. Composable: Se puede combinar con otros componentes
4. Testeable: Fácil de probar de forma aislada

## Estructura de un Componente

### Archivos por Componente

ComponentName/
- ComponentName.jsx (código del componente)
- ComponentName.module.css (estilos)
- ComponentName.test.jsx (tests)
- index.js (export)

### Template de Componente

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

export default function ComponentName({ prop1, prop2, onAction }) {
  // 1. Hooks de estado
  const [state, setState] = useState(initialValue);
  
  // 2. Hooks de efecto
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Funciones auxiliares
  const handleClick = () => {
    // Handle logic
    onAction();
  };
  
  // 4. Early returns
  if (!prop1) return null;
  
  // 5. Render
  return (
    <div className={styles.container}>
      <h2>{prop1}</h2>
      <button onClick={handleClick}>
        {prop2}
      </button>
    </div>
  );
}

## Tipos de Componentes

### 1. Componentes de Presentación (Dumb Components)

Solo reciben props y renderizan UI. Sin lógica de negocio.

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p></p>
      <button onClick={() => onAddToCart(product)}>
        Agregar al Carrito
      </button>
    </div>
  );
}

### 2. Componentes Contenedores (Smart Components)

Contienen lógica y estado. Pasan datos a componentes de presentación.

export default function ProductGrid() {
  const { products } = useInventory();
  const { addToCart } = useCart();
  
  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
}

### 3. Componentes de Layout

Estructura y organización de la página.

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

## Convenciones de Props

### Nombres de Props

- Booleanos: is, has, should (isLoading, hasError)
- Funciones: on, handle (onClick, handleSubmit)
- Datos: nombre descriptivo (product, user, items)

### Destructuring de Props

// ✅ Bien - Destructuring en parámetros
function Component({ title, items, onClose }) {
  return <div>{title}</div>;
}

// ❌ Mal - Props sin destructuring
function Component(props) {
  return <div>{props.title}</div>;
}

### Default Props

function Button({ children, variant = 'primary', disabled = false }) {
  return (
    <button className={styles[variant]} disabled={disabled}>
      {children}
    </button>
  );
}

## Estilos con CSS Modules

### Archivo .module.css

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

### Uso en Componente

import styles from './ProductCard.module.css';

function ProductCard() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Content */}
      </div>
    </div>
  );
}

### Clases Condicionales

const buttonClass = isActive 
  ? styles.buttonActive 
  : styles.button;

return <button className={buttonClass}>Click</button>;

## Estado y Hooks

### useState

// ✅ Bien - Estado específico
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// ❌ Mal - Estado general
const [state, setState] = useState({ loading: false, error: null });

### useEffect

// ✅ Bien - Dependencies claras
useEffect(() => {
  fetchProducts();
}, [categoryId]);

// ❌ Mal - Sin dependencies
useEffect(() => {
  fetchProducts();
});

### Custom Hooks

// hooks/useCart.js
export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  
  return context;
}

## Manejo de Eventos

### Nombrar Handlers

// ✅ Bien - Nombres descriptivos
const handleAddToCart = () => { };
const handleRemoveItem = (id) => { };
const handleFormSubmit = (e) => { };

// ❌ Mal - Nombres genéricos
const click = () => { };
const remove = () => { };

### Prevenir Defaults

function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

## Conditional Rendering

### Early Return

if (!product) {
  return <div>Producto no encontrado</div>;
}

return <ProductCard product={product} />;

### Operador Ternario

{isLoading ? <Spinner /> : <ProductList />}

### Operador AND

{error && <ErrorMessage message={error} />}
{items.length > 0 && <ItemList items={items} />}

## Listas y Keys

// ✅ Bien - Key única y estable
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}

// ❌ Mal - Index como key
{products.map((product, index) => (
  <ProductCard key={index} product={product} />
))}

## Composición de Componentes

### Children

function Modal({ children, onClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        {children}
      </div>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}

// Uso
<Modal onClose={handleClose}>
  <h2>Título</h2>
  <p>Contenido del modal</p>
</Modal>

### Render Props

function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  
  return render(data);
}

// Uso
<DataFetcher 
  url="/api/products"
  render={(products) => <ProductList products={products} />}
/>

## Performance

### React.memo

const ProductCard = React.memo(function ProductCard({ product }) {
  return <div>{product.name}</div>;
});

### useCallback

const handleAddToCart = useCallback((product) => {
  addToCart(product);
}, [addToCart]);

### useMemo

const sortedProducts = useMemo(() => {
  return products.sort((a, b) => a.price - b.price);
}, [products]);

## Testing

### Test Básico

import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

test('renders product name', () => {
  const product = { id: 1, name: 'Chaqueta', price: 89.99 };
  render(<ProductCard product={product} />);
  expect(screen.getByText('Chaqueta')).toBeInTheDocument();
});

### Test con Eventos

import { render, screen, fireEvent } from '@testing-library/react';

test('calls onAddToCart when button is clicked', () => {
  const mockAddToCart = jest.fn();
  render(<ProductCard product={product} onAddToCart={mockAddToCart} />);
  
  fireEvent.click(screen.getByText('Agregar'));
  expect(mockAddToCart).toHaveBeenCalledWith(product);
});

## Accesibilidad

### Atributos ARIA

<button 
  aria-label="Agregar al carrito"
  aria-disabled={isLoading}
>
  Agregar
</button>

### Semantic HTML

// ✅ Bien
<nav><a href="/home">Inicio</a></nav>
<main><article>Content</article></main>

// ❌ Mal
<div><div>Inicio</div></div>

## Checklist de Componente

Antes de hacer commit, verifica:

- [ ] Nombre descriptivo en PascalCase
- [ ] Props destructuradas
- [ ] Estilos en CSS Module
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Tests escritos
- [ ] Documentación de props complejas
- [ ] Accesibilidad básica
- [ ] Sin console.logs

## Recursos

- React Docs: https://react.dev
- Testing Library: https://testing-library.com
- CSS Modules: https://github.com/css-modules/css-modules

---

Ver también:
- ARCHITECTURE.md
- TESTING_STRATEGY.md
