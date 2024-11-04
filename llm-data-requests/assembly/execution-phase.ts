import {
  Bytes,
  Console,
  Process,
  httpFetch,
  proxyHttpFetch,
} from '@seda-protocol/as-sdk/assembly';

/**
 * Executes the data request phase to fetch a generated prompt from the API.
 * The input is the user's prompt that will be sent to the API.
 */
export function executionPhase(): void {
  // Get the user's prompt from the input parameters
  const userPrompt = Process.getInputs().toUtf8String();

  Console.log(`Generating prompt with input: ${userPrompt}`);

  // Note: We need to encode the user prompt for URL safety
  const encodedPrompt = encodeURIComponent(userPrompt);
  const response = proxyHttpFetch(
    `https://seda-oracle-production.up.railway.app/proxy/chatgpt?userPrompt=${encodedPrompt}`
  );

  // Check if the HTTP request was successful
  if (!response.ok) {
    const errorMsg = response.bytes.toUtf8String();
    Console.error(
      `HTTP Response failed: ${response.status.toString()} - ${errorMsg}`
    );
    Process.error(
      Bytes.fromUtf8String(
        `Failed to fetch generated prompt: HTTP ${response.status.toString()} - ${errorMsg}`
      )
    );
    return;
  }

  const generatedPrompt = response.bytes.toUtf8String();

  // Log the generated prompt for debugging
  Console.log(`Generated prompt: ${generatedPrompt}`);

  // Return the generated prompt as bytes
  Process.success(Bytes.fromUtf8String(generatedPrompt));
}
