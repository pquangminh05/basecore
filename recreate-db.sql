
-- Drop existing database
DROP DATABASE IF EXISTS basecoresales;

-- Create new database
CREATE DATABASE basecoresales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE basecoresales;

-- Create migration history table
CREATE TABLE __EFMigrationsHistory (
    MigrationId varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    ProductVersion varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (MigrationId)
) CHARACTER SET utf8mb4;

SELECT 'Database recreated successfully' as Status;
