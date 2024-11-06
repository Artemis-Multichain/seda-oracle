import { executionPhase } from './execution-phase.js';
import { tallyPhase } from './tally-phase.js';
import { OracleProgram } from '@seda-protocol/as-sdk';

/**
 * Defines a transaction verification oracle program that performs two main tasks:
 * 1. Verifies transaction status using Etherscan API during execution phase
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

// Runs the transaction verification oracle program by executing both phases
new TransactionVerifier().run();
