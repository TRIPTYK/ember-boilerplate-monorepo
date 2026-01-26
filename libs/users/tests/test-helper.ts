import { resumeTest } from "@ember/test-helpers";
import { afterEach, beforeEach } from "vitest";

const callback = (event: KeyboardEvent) => {
  console.log(event);

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
});
