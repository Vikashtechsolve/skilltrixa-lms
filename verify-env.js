#!/usr/bin/env node

/**
 * Script to verify environment variables are set correctly before build
 * Run: node verify-env.js
 */

const requiredEnvVars = [
  'VITE_API_URL'
];

const optionalEnvVars = [
  'VITE_RAZORPAY_KEY_ID',
  'VITE_RAZORPAY_CHECKOUT_SCRIPT_URL',
  'VITE_APP_NAME',
  'VITE_APP_DESCRIPTION',
  'VITE_APP_THEME_COLOR',
  'VITE_DEFAULT_CURRENCY',
  'VITE_PAYMENT_GATEWAY_NAME',
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('Required Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.error(`  ❌ ${varName}: NOT SET (REQUIRED)`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${varName}: ${value}`);
  }
});

console.log('\nOptional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.warn(`  ⚠️  ${varName}: NOT SET (using default)`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${varName}: ${value}`);
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.error('\n❌ BUILD FAILED: Required environment variables are missing!');
  console.error('Please set the required variables before building.\n');
  process.exit(1);
}

if (hasWarnings) {
  console.warn('\n⚠️  WARNING: Some optional variables are not set. Using defaults.\n');
} else {
  console.log('\n✅ All environment variables are set correctly!\n');
}

process.exit(0);

