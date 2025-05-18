// lib/cache.ts
import type { TestCase } from '@prisma/client';

const testCasesCache: Record<string, TestCase[]> = {};

export function getTestCasesFromCache(questionId: string): TestCase[]  {
  return testCasesCache[questionId];
}

export function setTestCasesInCache(questionId: string, testCases: TestCase[]): void {
  testCasesCache[questionId] = testCases;
}
