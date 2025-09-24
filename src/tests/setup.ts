import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { vi } from "vitest";

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();

  const mockPush = vi.fn();

  const mockedUseRouter = () => ({
    push: mockPush,
  });

  return {
    ...actual,
    useRouter: mockedUseRouter,
    mockPush,
    useSearchParams: vi.fn().mockReturnValue({
      get: vi.fn(),
      set: vi.fn(),
    }),
  };
});
