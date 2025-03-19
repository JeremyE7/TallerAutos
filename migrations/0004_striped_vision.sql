DROP INDEX "Cliente_cedula_unique";--> statement-breakpoint
DROP INDEX "Vehiculo_placa_unique";--> statement-breakpoint
ALTER TABLE `ElementosIngreso` ALTER COLUMN "combustible" TO "combustible" integer DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `Cliente_cedula_unique` ON `Cliente` (`cedula`);--> statement-breakpoint
CREATE UNIQUE INDEX `Vehiculo_placa_unique` ON `Vehiculo` (`placa`);