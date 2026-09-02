// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SavedTools } from "../client/src/pages/Home";

describe("SavedTools", () => {
  beforeEach(() => localStorage.clear());

  it("renders recent calculators and saved favorites from localStorage", async () => {
    localStorage.setItem("moneycalci-recent", JSON.stringify(["simpleInterest"]));
    localStorage.setItem("moneycalci-favorites", JSON.stringify(["markup"]));
    render(<SavedTools />);
    await waitFor(() => expect(screen.getByText("Recent calculators")).toBeTruthy());
    expect(screen.getByText("Simple Interest Calculator")).toBeTruthy();
    expect(screen.getByText("Saved favorites")).toBeTruthy();
    expect(screen.getByText("Markup Calculator")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Simple Interest Calculator" }).getAttribute("href")).toBe("/simple-interest-calculator");
  });
});
