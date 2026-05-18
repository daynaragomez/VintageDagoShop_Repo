# 📱 Guía de Migración a React Native - VintageDagoShop

Esta guía explica cómo migrar VintageDagoShop de React Web a React Native para crear apps móviles.

## Resumen Ejecutivo

- Reutilización de Código: 60-80%
- Tiempo de Desarrollo Móvil: 30-40% del tiempo web
- Complejidad: Media
- Resultado: Apps nativas iOS y Android

## Qué se Puede Reutilizar

### ✅ 100% Reutilizable

Carpeta: src/application/
- CartService.js
- InventoryService.js
- CheckoutService.js
- Todos los use cases
- Todos los validators

Carpeta: src/domain/
- Product.js
- CartItem.js
- Order.js
- Customer.js
- Todas las interfaces

Carpeta: src/shared/
- formatCurrency.js
- formatDate.js
- generateId.js
- Todas las constantes
- Todos los helpers

Carpeta: src/context/
- CartContext.jsx (con ajustes menores)
- InventoryContext.jsx

### ✅ 95% Reutilizable (con ajustes)

Carpeta: src/infrastructure/
- LocalStorage.js (usar AsyncStorage)
- API clients (mismo código)

### ❌ 0% Reutilizable (reescribir)

Carpeta: src/presentation/
- Todos los componentes UI
- Todas las páginas
- Hooks de UI específicos

## Comparación: Web vs Mobile

### Componente Web

import React from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p></p>
      <button onClick={() => addToCart(product)}>
        Agregar
      </button>
    </div>
  );
}

### Componente Mobile (React Native)

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}></Text>
      <TouchableOpacity onPress={() => addToCart(product)}>
        <Text>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

### Lógica Compartida (100% igual)

// useCart.js - FUNCIONA IGUAL EN WEB Y MOBILE
import { useContext } from 'react';
import { CartContext } from '@context/CartContext';
import { AddToCartUseCase } from '@usecases/AddToCartUseCase';

export function useCart() {
  const { dispatch } = useContext(CartContext);
  
  const addToCart = (product) => {
    const result = AddToCartUseCase.execute(product);
    dispatch({ type: 'ADD_ITEM', payload: result });
  };
  
  return { addToCart };
}

## Estructura de Proyecto Móvil

VintageDagoShop-Mobile/
- src/
  - screens/ (equivalente a pages/)
  - components/ (reescrito para RN)
  - navigation/ (React Navigation)
  - shared/ (copiado de web)
  - application/ (copiado de web)
  - domain/ (copiado de web)
  - infrastructure/ (copiado con ajustes)
  - context/ (copiado de web)

## Plan de Migración (5 Pasos)

### Paso 1: Setup de React Native

npx react-native init VintageDagoShopMobile
cd VintageDagoShopMobile

### Paso 2: Copiar Código Reutilizable

# Copiar carpetas compartidas
cp -r ../VintageDagoShop/src/application ./src/
cp -r ../VintageDagoShop/src/domain ./src/
cp -r ../VintageDagoShop/src/shared ./src/
cp -r ../VintageDagoShop/src/context ./src/

### Paso 3: Adaptar Infrastructure

# AsyncStorage en vez de LocalStorage
npm install @react-native-async-storage/async-storage

// storage/AsyncStorage.js (nuevo)
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
  static async get(key) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  
  static async set(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

### Paso 4: Reescribir Presentation Layer

# Instalar dependencias de navegación
npm install @react-navigation/native
npm install @react-navigation/native-stack

# Crear screens (equivalente a pages)
mkdir src/screens
touch src/screens/HomeScreen.jsx
touch src/screens/CheckoutScreen.jsx

### Paso 5: Configurar Navegación

// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

## Diferencias Principales

### HTML/CSS vs React Native

Web:             Mobile:
<div>       →    <View>
<span>      →    <Text>
<button>    →    <TouchableOpacity>
<img>       →    <Image>
<input>     →    <TextInput>
onClick     →    onPress
className   →    style

### Estilos

Web (CSS Modules):
.container {
  display: flex;
  padding: 20px;
}

Mobile (StyleSheet):
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
  }
});

### Storage

Web:
localStorage.setItem('key', value);

Mobile:
await AsyncStorage.setItem('key', value);

## Checklist de Migración

### Preparación
- [ ] Crear proyecto React Native
- [ ] Configurar estructura de carpetas
- [ ] Instalar dependencias

### Código Compartido
- [ ] Copiar application/
- [ ] Copiar domain/
- [ ] Copiar shared/
- [ ] Copiar context/
- [ ] Adaptar infrastructure/

### UI Móvil
- [ ] Crear screens principales
- [ ] Reescribir componentes para RN
- [ ] Configurar navegación
- [ ] Adaptar estilos

### Testing
- [ ] Probar en iOS
- [ ] Probar en Android
- [ ] Verificar funcionalidad completa

## Tiempo Estimado

- Setup inicial: 2-4 horas
- Adaptar infrastructure: 4-6 horas
- Reescribir UI: 20-30 horas
- Testing y ajustes: 10-15 horas

Total: 36-55 horas (vs 100+ horas si empiezas de cero)

## Ventajas de Esta Arquitectura

1. No reescribes lógica de negocio
2. Bugs arreglados una sola vez
3. Features nuevas en ambas plataformas simultáneamente
4. Un solo equipo puede mantener web y mobile
5. Tests se reutilizan

## Recursos

- React Native Docs: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- AsyncStorage: https://react-native-async-storage.github.io

## Soporte

Si tienes dudas sobre la migración, abre un issue en GitHub.

---

Ver también:
- ARCHITECTURE.md
- PROJECT_STRUCTURE.md
