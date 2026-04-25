-- Fix migrations history
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion)
VALUES ('20260318073813_InitialDatabase', '8.0.0')
ON DUPLICATE KEY UPDATE ProductVersion = '8.0.0';

-- Verify tables exist
SHOW TABLES LIKE 'Orders';
SHOW TABLES LIKE 'OrderDetails';

-- Check Orders table structure
DESCRIBE Orders;
DESCRIBE OrderDetails;
