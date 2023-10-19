import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/dashboard";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 3600).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

it("should render dashboard component", async () => {
  render(<Dashboard />);
  const myDashboardPage = screen.getByText("Dashboard Page");
  const mySignOut = screen.getByText("Sign Out");

  expect(myDashboardPage).toBeInTheDocument();
  expect(mySignOut).toBeInTheDocument();
});
