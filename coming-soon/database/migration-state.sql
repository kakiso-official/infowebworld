-- Migration: Add state column to submissions table
-- Run this in phpMyAdmin or MySQL CLI
-- Date: 2026-03-25

ALTER TABLE submissions ADD COLUMN state VARCHAR(100) DEFAULT NULL AFTER city;
