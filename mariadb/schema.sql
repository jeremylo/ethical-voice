SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `mydata`;
CREATE DATABASE `mydata` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `mydata`;

DELIMITER ;;

CREATE DEFINER=`root`@`localhost` EVENT `Clear month-old tokens` ON SCHEDULE EVERY 1 DAY STARTS '2021-08-05 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM remember_me WHERE created_at < NOW() - INTERVAL 4 WEEK;;

DELIMITER ;

DROP TABLE IF EXISTS `remember_me`;
CREATE TABLE `remember_me` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `token` (`token`),
  CONSTRAINT `remember_me_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `sros`;
CREATE TABLE `sros` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `trusted` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci `ENCRYPTED`=YES;


DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `outward_postcode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `audio` mediumblob DEFAULT NULL,
  `test_type_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `received_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `test_type_id` (`test_type_id`),
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`test_type_id`) REFERENCES `test_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci `ENCRYPTED`=YES;


DROP TABLE IF EXISTS `submission_metadata`;
CREATE TABLE `submission_metadata` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) unsigned NOT NULL,
  `metadata_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `submission_id` (`submission_id`),
  CONSTRAINT `submission_metadata_ibfk_3` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci `ENCRYPTED`=YES;


DROP TABLE IF EXISTS `test_types`;
CREATE TABLE `test_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `instruction` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `possible_durations` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `test_types` (`id`, `title`, `instruction`, `possible_durations`, `active`) VALUES
(1,	'Counting numbers',	'Please count out loud up from one clearly at a fast but comfortable speaking pace until the timer runs out.',	'[10,30,60,90,120]',	1),
(2,	'Repeating hippopotamus',	'Please repeatedly say \'hippopotamus\' at a fast but comfortable speaking pace until the timer runs out.',	'[30,60,90,120]',	1),
(3,	'Repeating helicopter',	'Please repeatedly say \'helicopter\' at a fast but comfortable speaking pace until the timer runs out.',	'[30,60,90,120]',	1);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reference_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outward_postcode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sharing` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `sro_id` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `extra` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id` (`reference_id`),
  UNIQUE KEY `email` (`email`),
  KEY `sro_id` (`sro_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`sro_id`) REFERENCES `sros` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci `ENCRYPTED`=YES;
