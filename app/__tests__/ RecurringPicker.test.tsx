import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecurringPicker from "../components/RecurringPicker";
import { Toaster } from "react-hot-toast";

describe("RecurringPicker Integration", () => {
  it("shows calendar after clicking Apply", async () => {
    render(
      <>
        <Toaster />
        <RecurringPicker />
      </>
    );

    const input = screen.getByLabelText("Start Date");
    expect(input).toBeInTheDocument();

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    await waitFor(() =>
      expect(screen.getByText("📆 Mini Calendar")).toBeInTheDocument()
    );
  });
});
