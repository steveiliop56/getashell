CREATE TABLE IF NOT EXISTS `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);