import { IAgentRuntime } from "@elizaos/eliza";
import { z } from "zod";

export const CronosZkEVMEnvSchema = z.object({
    CRONOSZKEVM_ADDRESS: z.string().min(1, "Cronos zkEVM address is required"),
    CRONOSZKEVM_PRIVATE_KEY: z
        .string()
        .min(1, "Cronos zkEVM private key is required"),
});

/**
 * Type definition for CronoszkEVMConfig, inferred from CronosZkEVMEnvSchema.
 */ 

export type CronoszkEVMConfig = z.infer<typeof CronosZkEVMEnvSchema>;

/**
 * Validates the CronosZkEVM configuration based on the provided runtime settings and environment variables.
 *
 * @param {IAgentRuntime} runtime - The Agent Runtime object containing runtime settings.
 * @returns {Promise<CronoszkEVMConfig>} Promise that resolves to the validated CronosZkEVM configuration.
 * @throws {Error} Throws an error if the configuration validation fails.
 */
export async function validateCronosZkevmConfig(
    runtime: IAgentRuntime
): Promise<CronoszkEVMConfig> {
    try {
        const config = {
            CRONOSZKEVM_ADDRESS:
                runtime.getSetting("CRONOSZKEVM_ADDRESS") ||
                process.env.CRONOSZKEVM_ADDRESS,
            CRONOSZKEVM_PRIVATE_KEY:
                runtime.getSetting("CRONOSZKEVM_PRIVATE_KEY") ||
                process.env.CRONOSZKEVM_PRIVATE_KEY,
        };

        return CronosZkEVMEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `CronosZkEVM configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
