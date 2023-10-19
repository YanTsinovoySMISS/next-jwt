import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../components/signup";

// Mocking the useToast hook
jest.mock("../shadcn/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("SignUp Component", () => {
  it("renders SignUp component correctly", () => {
    render(<SignUp setSignInMode={jest.fn()} />);
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  it("handles form submission and displays success message", async () => {
    render(<SignUp setSignInMode={jest.fn()} />);

    // Set initial form values
    fireEvent.change(screen.getByPlaceholderText("Enter full name..."), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter username..."), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
      target: { value: "password123" },
    });

    // Mock fetch function to simulate API call
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ userExists: false }),
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign Up"));

    // Wait for the API call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          username: "testuser",
          password: "password123",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
});
