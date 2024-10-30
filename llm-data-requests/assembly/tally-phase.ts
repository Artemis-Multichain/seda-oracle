import { Tally, Process, Bytes, Console } from '@seda-protocol/as-sdk/assembly';

/**
 * Executes the tally phase to determine the final prompt from multiple responses.
 * In this case, we'll use a simple "first valid response" strategy since
 * prompt generation might have slight variations between nodes.
 */
export function tallyPhase(): void {
  // Get all revealed results from the execution phase
  const reveals = Tally.getReveals();

  // Handle case where no results were revealed
  if (reveals.length === 0) {
    Process.error(Bytes.fromUtf8String('No results were revealed'));
    return;
  }

  // Take the first valid result
  // You could implement more sophisticated selection logic if needed
  const firstResult = reveals[0].reveal;

  // Log the selected result for debugging
  Console.log(`Selected prompt: ${firstResult.toUtf8String()}`);

  // Return the selected prompt
  Process.success(firstResult);
}
