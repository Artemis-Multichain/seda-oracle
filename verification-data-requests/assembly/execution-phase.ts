import {
  Bytes,
  Console,
  Process,
  httpFetch,
  u128,
} from '@seda-protocol/as-sdk/assembly';

@json
class PriceFeedResponse {
  price!: string;
}

/**
 * Executes the data request phase within the SEDA network.
 * This phase is responsible for fetching non-deterministic data (e.g., price of an asset pair)
 * from an external source such as a price feed API. The input specifies the asset pair to fetch.
 */
export function executionPhase(): void {
  const drInputsRaw = Process.getInputs().toUtf8String();

  Console.log(`Fetching price for pair: ${drInputsRaw}`);

  const drInputs = drInputsRaw.split('-');
  const symbolA = drInputs[0];
  const symbolB = drInputs[1];

  const response = httpFetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbolA.toUpperCase()}${symbolB.toUpperCase()}`
  );

  if (!response.ok) {
    Console.error(
      `HTTP Response was rejected: ${response.status.toString()} - ${response.bytes.toUtf8String()}`
    );

    Process.error(Bytes.fromUtf8String('Error while fetching price feed'));
  }

  const data = response.bytes.toJSON<PriceFeedResponse>();

  const priceFloat = f32.parse(data.price);
  if (isNaN(priceFloat)) {
    Process.error(
      Bytes.fromUtf8String(`Error while parsing price data: ${data.price}`)
    );
  }
  const result = u128.from(priceFloat * 1000000);

  Process.success(Bytes.fromNumber<u128>(result));
}
