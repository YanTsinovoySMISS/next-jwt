import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../components/signin";

// Mocking the useToast hook
jest.mock("../shadcn/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mocking useRouter and signIn functions
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  signIn: jest.fn(),
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock function calls before each test
  });

  it("renders SignIn component correctly", () => {
    render(<SignIn setSignInMode={jest.fn()} />);
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("displays validation error messages on invalid form submission", async () => {
    render(<SignIn setSignInMode={jest.fn()} />);
    const usernameInput = screen.getByPlaceholderText("Enter username...");
    const passwordInput = screen.getByPlaceholderText("Enter password...");
    const signInButton = screen.getByText("Sign In");

    // Submit the form without entering any data
    fireEvent.click(screen.getByText("Sign In"));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(
        screen.getByText("String must contain at least 2 character(s)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("String must contain at least 8 character(s)")
      ).toBeInTheDocument();
    });

    // Update form values with invalid data
    fireEvent.change(screen.getByPlaceholderText("Enter username..."), {
      target: { value: "a" }, // Less than 2 characters (minimum length)
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
      target: { value: "123" }, // Less than 8 characters (minimum length)
    });

    // Submit the form again
    fireEvent.click(screen.getByText("Sign In"));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(
        screen.getByText("String must contain at least 2 character(s)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("String must contain at least 8 character(s)")
      ).toBeInTheDocument();
    });

    // Correct the form values
    fireEvent.change(screen.getByPlaceholderText("Enter username..."), {
      target: { value: "validusername" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
      target: { value: "validpassword123" },
    });

    // Submit the form with valid data
    fireEvent.click(screen.getByText("Sign In"));

    // Wait for validation errors to disappear
    await waitFor(() => {
      expect(
        screen.queryByText("String must contain at least 2 character(s)")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("String must contain at least 8 character(s)")
      ).not.toBeInTheDocument();
    });
  });

  it("submits the form with valid data", () => {
    render(<SignIn setSignInMode={jest.fn()} />);
    const usernameInput = screen.getByPlaceholderText("Enter username...");
    const passwordInput = screen.getByPlaceholderText("Enter password...");
    const signInButton = screen.getByText("Sign In");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(signInButton);
  });
});
