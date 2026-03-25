-- Migration: Add faqs JSON column to submissions table
-- Run this in phpMyAdmin or MySQL CLI
-- Date: 2026-03-25

ALTER TABLE submissions ADD COLUMN faqs JSON DEFAULT NULL AFTER facebook;
