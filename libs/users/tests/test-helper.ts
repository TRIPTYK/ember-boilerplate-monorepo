import { resumeTest } from "@ember/test-helpers";
import { afterEach, beforeEach, vi } from "vitest";

const callback = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault();
    resumeTest();
  }
};

beforeEach(() => {
  document.addEventListener('keydown', callback);
});

afterEach(() => {
  document.removeEventListener('keydown', callback);
  vi.resetAllMocks();
});
