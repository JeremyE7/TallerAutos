CREATE TABLE `Cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`cedula` text NOT NULL,
	`direccion` text,
	`email` text,
	`telefono` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_cedula_unique` ON `Cliente` (`cedula`);--> statement-breakpoint
CREATE TABLE `ElementosIngreso` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`limpiaparabrisas` integer,
	`espejos` integer,
	`luces` integer,
	`placas` integer,
	`emblemas` integer,
	`radio` integer,
	`control_alarma` integer,
	`tapetes` integer,
	`aire_acondicionado` integer,
	`matricula` integer,
	`herramientas` integer,
	`tuerca_seguridad` integer,
	`gata` integer,
	`llave_ruedas` integer,
	`extintor` integer,
	`encendedor` integer,
	`antena` integer,
	`llanta_emergencia` integer
);
--> statement-breakpoint
CREATE TABLE `Fotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`frontal` text,
	`trasera` text,
	`derecha` text,
	`izquierda` text,
	`superior` text,
	`interior` text
);
--> statement-breakpoint
CREATE TABLE `OrdenTrabajo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fechaIngreso` text NOT NULL,
	`fechaSalida` text NOT NULL,
	`operaciones_solicitadas` text,
	`total_mo` real,
	`total_rep` real,
	`iva` real,
	`total` real,
	`comentarios` text,
	`vehiculo_id` integer NOT NULL,
	`elementos_ingreso_id` integer NOT NULL,
	`fotos_id` integer NOT NULL,
	`forma_pago` text NOT NULL,
	FOREIGN KEY (`vehiculo_id`) REFERENCES `Vehiculo`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`elementos_ingreso_id`) REFERENCES `ElementosIngreso`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`fotos_id`) REFERENCES `Fotos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Vehiculo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`marca` text NOT NULL,
	`modelo` text,
	`anio` integer,
	`chasis` text,
	`motor` text,
	`color` text,
	`placa` text NOT NULL,
	`kilometraje` integer,
	`combustible` integer,
	`cliente_id` integer NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `Cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Vehiculo_placa_unique` ON `Vehiculo` (`placa`);