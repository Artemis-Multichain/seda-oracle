// tests/index.test.ts
import { afterEach, describe, it, expect, mock } from 'bun:test';
import { file } from 'bun';
import {
  testOracleProgramExecution,
  testOracleProgramTally,
} from '@seda-protocol/dev-tools';

const WASM_PATH = 'build/debug.wasm';

const fetchMock = mock();

afterEach(() => {
  fetchMock.mockRestore();
});

describe('prompt generation execution', () => {
  it('should fetch and return a generated prompt', async () => {
    // Mock the API response
    fetchMock.mockImplementation((url) => {
      if (url.includes('artemysai.xyz')) {
        return new Response('This is a generated prompt response');
      }
      return new Response('Unknown request');
    });

    const oracleProgram = await file(WASM_PATH).arrayBuffer();

    const vmResult = await testOracleProgramExecution(
      Buffer.from(oracleProgram),
      Buffer.from('Hello world'), // Test input prompt
      fetchMock
    );

    expect(vmResult.exitCode).toBe(0);
    const result = Buffer.from(vmResult.result).toString();
    expect(result).toBe('This is a generated prompt response');
  });

  it('should handle API errors gracefully', async () => {
    fetchMock.mockImplementation(() => {
      return new Response('Error', { status: 500 });
    });

    const oracleProgram = await file(WASM_PATH).arrayBuffer();

    const vmResult = await testOracleProgramExecution(
      Buffer.from(oracleProgram),
      Buffer.from('Hello world'),
      fetchMock
    );

    expect(vmResult.exitCode).toBe(1);
  });
});

describe('prompt generation tally', () => {
  it('should select a valid prompt from reveals', async () => {
    const oracleProgram = await file(WASM_PATH).arrayBuffer();

    const testPrompt = Buffer.from('This is a test prompt');
    const vmResult = await testOracleProgramTally(
      Buffer.from(oracleProgram),
      Buffer.from(''),
      [
        {
          exitCode: 0,
          gasUsed: 0,
          inConsensus: true,
          result: testPrompt,
        },
      ]
    );

    expect(vmResult.exitCode).toBe(0);
    const result = Buffer.from(vmResult.result).toString();
    expect(result).toBe('This is a test prompt');
  });
});
