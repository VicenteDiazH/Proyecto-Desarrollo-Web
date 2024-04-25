----------------------------------------------------------------------------
--CLASE 8--
----------------------------------------------------------------------------
--Buscar la ciudad en la que está el departamento de ventas--
SELECT d.ciudad
FROM deptos d
WHERE nombre = 'SALES';

--Buscar RUT y nombre de los clientes de Providencia--
SELECT c.RUT, c.nombre
FROM clientes c
WHERE comuna = 'Providencia';

--Buscar precios del proyector y del televisor--
SELECT p.nombre, p.precio
FROM productos p
WHERE nombre='proyector' or nombre='televisor';

----------------------------------------------------------------------------
--CLASE 9--
----------------------------------------------------------------------------
--Grado de sueldo que está CLARK--
SELECT g.grado
FROM empleados e
JOIN grados g ON e.sueldo >= g.sueldo_inf AND e.sueldo<=g.sueldo_sup
WHERE e.nombre = 'CLARK';

--Nombre de los productos comprados por los habitantes de Las Condes--
SELECT p.nombre
FROM productos p
JOIN ventas_detalle dv ON dv.cod_producto = p.codigo
JOIN ventas v ON v.num_venta = dv.num_venta
JOIN clientes c ON c.rut = v.rut_cliente
WHERE comuna = 'Las Condes'
GROUP BY p.nombre; --reduce los elementos repetidos--

--Nombre y precio de los productos vendidos por MARTIN--
SELECT p.nombre, p.precio
FROM productos p
JOIN ventas_detalle dv ON dv.cod_producto = p.codigo
JOIN ventas v ON v.num_venta = dv.num_venta
JOIN empleados e ON e.rut = v.rut_vende
WHERE e.nombre = 'MARTIN';

--Nombre de los clientes que han comprado productos que valen $300--
SELECT c.nombre
FROM clientes c
JOIN ventas v ON v.rut_cliente = c.rut
JOIN ventas_detalle vd ON vd.num_venta = v.num_venta
JOIN productos p ON p.codigo = vd.cod_producto
WHERE p.precio = 300
GROUP BY c.nombre; --reduce los elementos repetidos--

--Número de productos que valen más de $250--
SELECT COUNT(*)
FROM productos
WHERE precio > 250;

--Cantidad total de mesas vendidas--
SELECT SUM(vd.cantidad)
FROM ventas_detalle vd
JOIN productos p ON p.codigo = vd.cod_producto
WHERE p.nombre = 'mesa';

--Total pagado por Pepe por todas las compras que ha hecho--
SELECT SUM(p.precio * vd.cantidad)
FROM productos p
JOIN ventas_detalle vd ON vd.cod_producto = p.codigo
JOIN ventas v ON v.num_venta = vd.num_venta
JOIN clientes c ON c.rut = v.rut_cliente
WHERE c.nombre = 'Pepe';

--Monto total de comisiones ganadas por ALLEN--
SELECT e.comision * SUM(v.num_venta) AS comision_total
FROM empleados e
JOIN ventas v ON v.rut_vende = e.rut
WHERE e.nombre = 'ALLEN'
GROUP BY e.comision

--Nombre del jefe de SCOTT--
SELECT e2.nombre
FROM empleados e
JOIN empleados e2 ON e2.rut = e.rut_jefe
WHERE e.nombre = 'SCOTT';

----------------------------------------------------------------------------
--CLASE 10--
----------------------------------------------------------------------------
--Total pagado por Pepe por todas las compras que ha hecho--
SELECT SUM(p.precio * vd.cantidad)
FROM productos p
JOIN ventas_detalle vd ON vd.cod_producto = p.codigo
JOIN ventas v ON v.num_venta = vd.num_venta
JOIN clientes c ON c.rut = v.rut_cliente
WHERE c.nombre = 'Pepe';

--Nombre y precio del producto más caro--
SELECT p.nombre, p.precio
FROM productos p
WHERE p.precio = (SELECT MAX(precio) FROM productos);

--Nombre y sueldo del empleado de NEW YORK que tiene el peor sueldo--
SELECT e.nombre, e.sueldo
FROM empleados e
JOIN deptos s ON s.numdep = e.numdep
JOIN(
    SELECT MIN(e.sueldo) AS sueldo_minimo
    FROM empleados e
    JOIN deptos s ON s.numdep = e.numdep
    WHERE s.ciudad = 'NEW YORK'
)sm ON sm.sueldo_minimo = e.sueldo
WHERE s.ciudad = 'NEW YORK';

--RUT de los clientes y el monto total comprado por cada uno de ellos--
SELECT c.rut, SUM(v.monto) AS monto_total
FROM clientes c
JOIN ventas v ON v.rut_cliente = c.rut 
GROUP BY c.rut;

----------------------------------------------------------------------------
--CLASE 11--
----------------------------------------------------------------------------
--Nombre del vendedor que ha vendido el producto más caro--
SELECT e.nombre
FROM empleados e
JOIN ventas v ON v.rut_vende = e.rut
JOIN ventas_detalle vd ON vd.num_venta = v.num_venta
JOIN productos p ON p.codigo = vd.cod_producto
JOIN(
    SELECT MAX(precio) AS precio_maximo
    FROM productos
) pm ON pm.precio_maximo = p.precio;

--Nombre del cliente que ha comprado más veces en la tienda--
SELECT c.nombre
FROM clientes c 
JOIN ventas v ON v.rut_cliente = c.rut 
JOIN(
    SELECT rut_cliente, COUNT(v.num_venta) AS cantidad_ventas
    FROM ventas v 
    GROUP BY rut_cliente
) cv ON cv.rut_cliente = c.rut
JOIN(
    SELECT MAX(cantidad_ventas) AS cantidad_maxima
    FROM(
        SELECT rut_cliente, COUNT(v.num_venta) AS cantidad_ventas
        FROM ventas v 
        GROUP BY rut_cliente
    ) cv 
) cm ON cm.cantidad_maxima = cv.cantidad_ventas;


----------------------------------------------------------------------------
--SOLEMNE 1--
----------------------------------------------------------------------------
--Cuales fueron los artistas que escucho ‘Pablito de la Cruz’ el día 01/03/2022. --
SELECT a.nombre_arstico
FROM usuarios u
JOIN reproducciones r ON r.usuario_id = u.id
JOIN canciones c ON c.id = r.cancion_id
JOIN artistas a ON a.id = c.artista_id
WHERE r.fecha = '01/03/2022'
AND u.nombre = 'Pablito'
AND u.apellido = 'de la Cruz';

--Si cada reproducción se paga a 5 pesos ¿cuánto ha ganado cada artista? --
SELECT a.id,nombre_arstico,COUNT(*)*5 AS ganancia
FROM reproducciones r
JOIN canciones c ON c.id = r.cancion_id
JOIN artistas a ON a.id = c.artista_id
GROUP BY(a.id, a.nombre_arstico);

--Cual es el artista con menos canciones. --
WITH canciones_por_artista AS (
    SELECT a.id, a.nombre_arstico, COUNT(*) AS cantidad_canciones
    FROM canciones c
    JOIN artistas a ON a.id = c.artista_id
    GROUP BY(a.id, a.nombre_arstico)
),
emergente AS (
    SELECT MIN(cantidad_canciones) AS minimo
    FROM canciones_por_artista;
)
SELECT a.nombre_arstico
FROM canciones_por_artista c
JOIN emergente e ON e.minimo = c.cantidad_canciones;

--Cuantas canciones tiene en promedio los artista en Musify. --
WITH canciones_por_artista AS (
    SELECT a.id, a.nombre_arstico, COUNT(*) AS cantidad_canciones
    FROM canciones c
    JOIN artistas a ON a.id = c.artista_id
    GROUP BY(a.id, a.nombre_arstico)
)
SELECT AVG(cantidad_canciones)
FROM canciones_por_artista;

--Quienes han escuchado las canciones del artista Eco Callejero --
SELECT u.nombre, u.apellido
FROM usuarios u
JOIN reproducciones r ON r.usuario_id = u.id
JOIN canciones c ON c.id = r.cancion_id
JOIN artistas a ON a.id = c.artista_id
WHERE a.nombre_arstico = 'Eco Callejero';

--Cuales son las canciones del individuo ‘Carlos Javier Raín Pailacheo’ --
SELECT c.nombre
FROM canciones
JOIN artistas a ON a.id = c.artista_id
WHERE a.nombre_arstico = 'Carlos Javier Rain Pailacheo';