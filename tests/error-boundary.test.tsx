// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ErrorBoundary from "../client/src/components/ErrorBoundary";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("ErrorBoundary", () => {
  it("keeps internal error details out of the user-facing fallback", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    function BrokenChild(): React.ReactElement { throw new Error("database password should not render"); }
    render(<ErrorBoundary><BrokenChild /></ErrorBoundary>);
    expect(screen.getByText("An unexpected error occurred.")).toBeTruthy();
    expect(screen.getByText(/Please reload the page/)).toBeTruthy();
    expect(screen.queryByText(/database password/)).toBeNull();
  });
});
