import { executionPhase } from './execution-phase';
import { tallyPhase } from './tally-phase';
import { OracleProgram } from '@seda-protocol/as-sdk/assembly';

/**
 * Defines a prompt generation oracle program that:
 * 1. Fetches generated prompts from the API during execution phase
 * 2. Selects a final prompt from multiple results in the tally phase
 */
class PromptGenerator extends OracleProgram {
  execution(): void {
    executionPhase();
  }

  tally(): void {
    tallyPhase();
  }
}

// Run the prompt generator oracle program
new PromptGenerator().run();
