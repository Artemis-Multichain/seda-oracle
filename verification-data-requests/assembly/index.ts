import { executionPhase } from './execution-phase';
import { tallyPhase } from './tally-phase';
import { OracleProgram } from '@seda-protocol/as-sdk';

class TxVerification extends OracleProgram {
  execution(): void {
    executionPhase();
  }

  tally(): void {
    tallyPhase();
  }
}

new TxVerification().run();
