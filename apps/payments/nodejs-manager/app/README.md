# Voltage Payments NodeJS Manager

An interactive CLI application to manage your Voltage payment environment using the official Voltage API SDK.

## Features

- 🌐 **SDK-powered**: Uses the official Voltage API SDK directly for reliability and type safety
- 📝 **TypeScript Support**: Full TypeScript support through the SDK
- 🔒 **Secure**: Environment variable-based configuration
- ⚡ **Modern**: Built with modern JavaScript features and best practices
- 🎯 **Simplified**: Direct SDK usage without unnecessary abstraction layers

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your actual Voltage API credentials
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Environment Variables

The following environment variables are required:

- `VOLTAGE_API_KEY` - Your Voltage API key (starts with vltg_)
- `VOLTAGE_ORGANIZATION_ID` - Your organization ID (UUID format)
- `VOLTAGE_ENVIRONMENT_ID` - Your environment ID (UUID format)
- `VOLTAGE_WALLET_ID` - Your wallet ID (UUID format)

Optional environment variables:

- `VOLTAGE_BASE_URL` - Custom base URL (defaults to https://voltageapi.com/v1)
- `VOLTAGE_TIMEOUT` - Request timeout in milliseconds (defaults to 30000)

## Requirements

- Node.js 16 or higher
- A Voltage account with API access