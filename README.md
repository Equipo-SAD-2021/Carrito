# Carrito de la compra

Seminario nodeJs - Actividad 1

## Introducción 🚀

Este seminario forma parte de la asignatura de Servicios y Aplicaciones Distribuidas (SAD) impartida en el Máster Universitario en Ingeniería Informática de la UPV. En esta materia se presentan los principios, aproximaciones y tecnologías disponibles para el desarrollo de servicios y aplicaciones distribuidas. 

Este seminario gira alrededor de los patrones de JavaScript asíncronos, destacando el uso de conceptos como _callbacks_, _promises_ y bloques _async/await_. Con estas herramientas se da forma a un carrito de la compra que permite realizar operaciones básicas como añadir un producto al carro, eliminar un producto o traducir su contenido a una String.


## Pre-requisitos 📋

El *software* necesario para ejecutar el proyecto es:

* **Node** - Entorno de ejecución utilizado
* **MongoDB** - Base de datos utilizada

El cual se ha ejecutado en un entorno de desarrollo virtualizado construido con **Vagrant** utilizando **VirtualBox**. Este proceso se detallará en la **Instalación**.

## Instalación 🔧

Partiendo de los VagrantFiles que se nos proporcionó en la asignatura, establecemos una máquina Vagrant cuya configuración está disponible en el directorio `vagrant_config` del repositorio. A partir de esta máquina, elaboramos un entorno con Nodejs y un servidor MongoDB. Para poner esta máquina en funcionamiento se deben seguir los siguiente comandos:

Primero lanzamos el entorno dentro de la carpeta `vagrant_config`:
```
vagrant up
vagrant ssh
```

En este entorno se dispone de una carpeta compartida `/vagrant` que comunica el _host_ con la máquina virtual. Una vez iniciada la máquina, utilizaremos esta carpeta como directorio de trabajo, puesto que nos permitirá acceder desde los ficheros desde los dos puntos. Hecho esto, procederemos a instalar el módulo mongodb con la herramienta npm:
```
npm install mongodb
```

Tras esta instrucción ya tenemos la instalación lista.


## Desarrollo :hammer_and_wrench:
El proyecto se compone de un módulo JavaScript cuyo archivo principal es `CarroCompra.js`.

### CarroCompra.js

Se trata de módulo que implementa el carro de la compra, en el cual se definen las siguientes clases:

-	`Item`: respresentan objetos creados a partir de un nombre y una cantidad de unidades. Se proporcionan getters para dichos atributos, así como los métodos para añadir y quitar unidades.

-	`ItemDBController`: Consta de un único método estático `Connect()` que establece la conexión a una base de datos MongoDB que nos permite comprobar la cantidad de `Item` disponibles. Esta conexión se retorna como un objeto `ItemDBControllerConnection` sobre el que hacer las operaciones en la base de datos.

-	`ItemDBControllerConnection`: consta de métodos para realizar las operaciones sobre la base de datos: obtención de objetos `Item` (`GetItem()`), un método de ingreso de datos en la BD establecido para pruebas (`Populate()`) y, una función para cerrar la conexión con MongoDB (`Close()`).

-	`ShoppingCart`: objetos carro de compra. Las siguientes operaciones utilizan un objeto `ItemDBControllerConnection` para comprobar la disponibilidad del inventario de `Item` en la base de datos. Estas son:
    - Añadir un objeto `Item` si no existe.
    - Añadir o quitar unidades de un `Item` ya existente.
    - Traducción del contenido del carro a una cadena de caracteres.



## Pruebas 🔩

Se ha creado un archivo JavaScript cuyo propósito es la comprobación de la funcionalidad del módulo. Se puede ejecutar mediante la orden:
```
npm test
```

### CarroCompraTest.js
En primer lugar, se importa el módulo `CarroCompra`, se crea una conexión con la base de datos MongoDB de manera local y se ingresan los datos de prueba en esta. A continuación, se hacen diversas operaciones que comprueban el correcto funcionamiento del módulo. Estas son añadir y quitar objetos comprobando que las operaciones tengan en cuenta la disponibilidad de onbjetos en la base de datos.


## Relación del código con los conceptos de asincronía de JavaScript :twisted_rightwards_arrows:

Todas las operaciones sobre el objeto `ItemDBControllerConnection` utilizan promesas, de la misma manera que todas las operaciones sobre `ShoppingCart`. Además, dichas operaciones realizan una correcta propagación de errores. Para poder asegurarnos de la ejecución síncrona de ciertas operaciones, se ha hecho uso de bloques *async*/*await*. Nótese, también, el uso de *callbacks* en las funciones *then*, *catch* y *finally*, utilizadas en el manejo de promesas.


## Autores ✒️

* **Antonio Martínez Leal** - [AntonioM15](https://github.com/AntonioM15)
* **Pablo Moreira Flors** - [PabloMK7](https://github.com/mariohackandglitch)
* **Borja Sanz Gresa** - [BorjaSanz11](https://github.com/BorjaSanz11)
