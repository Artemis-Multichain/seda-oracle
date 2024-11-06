import { executionPhase } from './execution-phase';
import { tallyPhase } from './tally-phase';
import { OracleProgram } from '@seda-protocol/as-sdk/assembly';

/**
 * Defines a transaction verification oracle program that performs two main tasks:
 * 1. Verifies transaction status using Etherscan data proxy API during execution phase
 * 2. Aggregates the results from multiple executors in the tally phase to reach consensus
 */
class TransactionVerifier extends OracleProgram {
  execution(): void {
    executionPhase();
  }

  tally(): void {
    tallyPhase();
  }
}

new TransactionVerifier().run();
