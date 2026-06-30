import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router";
import MainLayout from "../../../app/layouts/MainLayout";

function createLayoutRouter(): ReturnType<typeof createMemoryRouter> {
  return createMemoryRouter(
    [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <div>Template route body</div> },
        ],
      },
    ],
    { initialEntries: ["/"] },
  );
}

describe("main layout", () => {
  it("renders the app shell and route outlet", () => {
    render(<RouterProvider router={createLayoutRouter()} />);

    expect(screen.getByText("Template route body")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("p-4");
  });
});
