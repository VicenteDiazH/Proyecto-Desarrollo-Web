# Desarrollo Web

Repositorio de proyecto desarrollado en equipo para el ramo Desarrollo Web, UDP. 

## Integrantes

- Vicente Diaz
- Benjamin Polanco


---


# TorNotes 

Plataforma e-commerce web de venta de discos de vinilo y álbumes musicales desarrollada con **Node.js, Express, MongoDB Atlas, Express-Handlebars y Passport.js**.

---

##  Credenciales de Administrador

- **Email:** `admin@gmail.com`
- **Contraseña:** `admintest`

---

##  Requisitos e Instalación

### 1. Requisitos Previos
- **Node.js** (v18 o superior)
- **npm**

### 2. Levantar el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (.env)
# El archivo .env debe ubicarse en la raíz del proyecto con la siguiente estructura:
MONGODB_URI=mongodb+srv://benjapolanco58_db_user:SHy1syW1wlUalhbu@portafolio.a6qr325.mongodb.net/tienda?retryWrites=true&w=majority&appName=portafolio
PORT=3000
SESSION_SECRET=proyecto-desarrollo-web-secret-key-2024

# 3. Iniciar el servidor
npm start
```

Abrir navegador en: **[http://localhost:3000](http://localhost:3000)**

---

##  Funcionamiento de la Aplicación

1. **Autenticación (Passport.js)**: Registro e inicio de sesión seguro con contraseñas encriptadas (`bcryptjs`) y manejo de sesiones.
2. **Control de Roles (`USER` / `ADMIN`)**:
   - **`USER`**: Explora el catálogo, añade productos al carrito, recarga su wallet, realiza compras y consulta sus recibos.
   - **`ADMIN`**: Tiene acceso exclusivo a la opción **"Gestión de productos"** para añadir nuevos productos al catálogo y eliminar existentes.
3. **Carrito y Compras**: Maneja selección de ítems, verificación de stock disponible y flujo de pago con dinero en wallet.
4. **Recibos y Perfil**: Al pagar, genera automáticamente un recibo detallado con imagen, cantidad y precio. En **Mi cuenta** se puede personalizar el nombre y la foto de perfil.
