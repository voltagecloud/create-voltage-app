const chalk = require("chalk");
const fs = require("fs");

const APP_NAME = "SvelteKit Payments Component";

function script({
  voltageBackendUrl,
  apiKey,
  walletId,
  teamId,
  environmentId,
  src,
  dest,
}) {
  // Create .env file with Voltage configuration
  const envContent = `# Voltage API Configuration
PUBLIC_VOLTAGE_API_KEY=${apiKey}
PUBLIC_VOLTAGE_ORGANIZATION_ID=${teamId}
PUBLIC_VOLTAGE_ENVIRONMENT_ID=${environmentId}
PUBLIC_VOLTAGE_WALLET_ID=${walletId}
PUBLIC_VOLTAGE_BASE_URL=${voltageBackendUrl}
`;

  fs.writeFileSync(`${dest}/.env`, envContent);

  // hardcode the vite.config.ts file's with the base url
  fs.writeFileSync(
    `${dest}/vite.config.ts`,
    `
		import { sveltekit } from '@sveltejs/kit/vite';
		import { defineConfig } from 'vite';
		
		export default defineConfig({
			plugins: [sveltekit()],
			server: {
				strictPort: true, // Fail if port is already in use instead of trying another
				proxy: {
					'/api/voltage': {
						target: '${voltageBackendUrl}',
						changeOrigin: true,
						rewrite: (path) => path.replace(/^\\/api\\/voltage/, '')
					}
				}
			}
		});
		`
  );

  // prettier-ignore
  console.log(`
${chalk.gray("Your SvelteKit Payments Component Demo is ready! 🎉")}

${chalk.yellow("Next steps:")}
${`1. cd ${dest}`}
${`2. npm install`}
${`3. npm run dev`}

${chalk.yellow("Note:")} ${chalk.gray("Make sure you have Node.js 16+ installed to run the demo.")}`);
}

module.exports = {
  name: APP_NAME,
  script,
};
