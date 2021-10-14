# Carrito de la compra

Seminario nodeJs - Actividad 1

## Introducción 🚀

Este seminario forma parte de la asignatura de Servicios y Aplicaciones Distribuidas (SAD) impartida en el Máster Universitario en Ingeniería Informática de la UPV. En esta materia se presentan los principios, aproximaciones y tecnologías disponibles para el desarrollo de servicios y aplicaciones distribuidas. 

Este seminario gira alrededor de los patrones de JavaScript asíncronos, destacando el uso de conceptos como callbacks, promises y bloques async/await. Con estas herramientas se da forma a un carrito de la compra que permite realizar operaciones básicas como añadir un producto al carro, eliminar un producto o traducir su contenido a una String.


### Pre-requisitos 📋

El software necesario para ejecutar el proyecto es:

* **Node** - Entorno de ejecución utilizado
* **MongoDB** - Base de datos utilizada

El cual se ha ejecutado en un entorno de desarrollo virtualizado construido con **Vagrant** utilizando **VirtualBox**. Este proceso se detallará en la **Instalación**.

### Instalación 🔧

Partiendo de los VagrantFiles que se nos proporcionó en la asignatura, establecemos una máquina Vagrant cuya configuración está disponible en el directorio "vagrant_config". A partir de esta máquina, elaboramos un entorno con Nodejs y un servidor MongoDB. Para poner esta máquina en funcionamiento se deben seguir los siguiente comandos:

Primero lanzamos el entorno dentro de la carpeta vagrant_config:
```
vagrant up
vagrant ssh
```

En este entorno se dispone de una carpeta compartida que comunica el host con la máquina virtual. Una vez iniciada la máquina, utilizaremos esta carpeta como directorio de trabajo, puesto que nos permitirá acceder desde los ficheros desde los dos puntos. Procederemos a instalar el módulo mongodb con la herramienta npm:
```
npm install mongodb
```

Tras esta instrucción ya tenemos la instalación lista.


## Desarrollo ⚙️

El fichero “CarroCompra.js” se divide en las siguientes partes principales:

-	Clase “Item”: objetos item creados a partir de un nombre y una cantidad de unidades. Se proporcionan getters para dichos atributos, así como los métodos para añadir y quitar cantidades.

-	Clase “ShoppingCart”: objetos carro de compra. Se dispone de métodos para manejar los objetos item (en un atributo vector de Items): añadir, quitar y toString.

-	Clase “ItemDBController”: se establece una conexión local a una base de datos MongoDB que nos permite almacenar los Items. De esta manera, el carro de compra accederá a la base de datos para realizar sus operaciones en función de los items disponibles. Se dispone de los métodos que manejan la conexión a la BD (constructor, connect y close), el método de obtención de objetos item y, un método para ingresar datos en la BD.

Relación del código con los conceptos de asincronía de JavaScript:
-	Promesas: 
-	Callbacks:
-	Bloques async/await:
*INSERTAR EN FUNCIÓN DE LÍNEAS O NOMBRE DE MÉTODOS CUANDO EL CÓDIGO ESTÉ ACABADO*



### Pruebas 🔩




## Autores ✒️

* **Antonio Martínez Leal** - [AntonioM15](https://github.com/AntonioM15)
* **Pablo Moreira Flors** - [PabloMK7](https://github.com/mariohackandglitch)
* **Borja Sanz Gresa** - [BorjaSanz11](https://github.com/BorjaSanz11)
