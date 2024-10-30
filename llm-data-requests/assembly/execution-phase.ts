import {
  Bytes,
  Console,
  Process,
  httpFetch,
} from "@seda-protocol/as-sdk/assembly";

/**
 * Executes the data request phase to fetch a generated prompt from the API.
 * The input is the user's prompt that will be sent to the API.
 */
export function executionPhase(): void {
  // Get the user's prompt from the input parameters
  const userPrompt = Process.getInputs().toUtf8String();
  
  Console.log(`Generating prompt with input: ${userPrompt}`);

  // Construct the API URL with the user prompt
  // Note: We need to encode the user prompt for URL safety
  const encodedPrompt = encodeURIComponent(userPrompt);
  const response = httpFetch(
    `https://www.artemysai.xyz/api/generatePrompt?userPrompt=${encodedPrompt}`
  );

  // Check if the HTTP request was successful
  if (!response.ok) {
    Console.error(
      `HTTP Response failed: ${response.status.toString()} - ${response.bytes.toUtf8String()}`
    );
    Process.error(Bytes.fromUtf8String("Error while fetching generated prompt"));
    return;
  }

  // The response is plain text, so we can directly use it
  const generatedPrompt = response.bytes.toUtf8String();
  
  // Log the generated prompt for debugging
  Console.log(`Generated prompt: ${generatedPrompt}`);

  // Return the generated prompt as bytes
  Process.success(Bytes.fromUtf8String(generatedPrompt));
}