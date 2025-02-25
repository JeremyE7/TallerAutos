DROP INDEX "Cliente_cedula_unique";--> statement-breakpoint
DROP INDEX "Vehiculo_placa_unique";--> statement-breakpoint
ALTER TABLE `OrdenTrabajo` ALTER COLUMN "estado" TO "estado" text NOT NULL DEFAULT 'Pendiente';--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_cedula_unique` ON `Cliente` (`cedula`);--> statement-breakpoint
CREATE UNIQUE INDEX `Vehiculo_placa_unique` ON `Vehiculo` (`placa`);