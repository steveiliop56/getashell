CREATE TABLE IF NOT EXISTS `shells` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`distro` text NOT NULL,
	`name` text NOT NULL,
	`port` integer NOT NULL,
	`password` text NOT NULL,
	`extraArgs` text
);
