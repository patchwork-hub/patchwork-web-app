import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PollForm } from "@/components/organisms/compose/form/PollForm";


vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark" }),
}));

vi.mock("@/providers/localeProvider", () => ({
  useLocale: () => ({
    t: (key: string) => key, 
  }),
}));


vi.mock("@/components/atoms/ui/button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/atoms/ui/input", () => ({
  Input: ({ value, onChange, placeholder }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="input"
    />
  ),
}));


vi.mock("@/components/atoms/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe("PollForm - Basic Tests", () => {
  const defaultProps = {
    pollOptions: ["Option 1", "Option 2"],
    setPollOptions: vi.fn(),
    pollChoiceType: "single" as const,
    setPollChoiceType: vi.fn(),
    pollDuration: 1440,
    setPollDuration: vi.fn(),
  };

  it("renders without crashing", () => {
    render(<PollForm {...defaultProps} />);
    expect(screen.getByText("poll.create_title")).toBeInTheDocument();
  });

  it("displays initial options", () => {
    render(<PollForm {...defaultProps} />);
    
    const inputs = screen.getAllByTestId("input");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue("Option 1");
    expect(inputs[1]).toHaveValue("Option 2");
  });

  it("adds new option when button is clicked", () => {
    render(<PollForm {...defaultProps} />);
    
    const addButton = screen.getByText("poll.add_option");
    fireEvent.click(addButton);
    
    expect(defaultProps.setPollOptions).toHaveBeenCalledWith(["Option 1", "Option 2", ""]);
  });

  it("updates option text", () => {
    render(<PollForm {...defaultProps} />);
    
    const inputs = screen.getAllByTestId("input");
    fireEvent.change(inputs[0], { target: { value: "Updated Option" } });
    
    expect(defaultProps.setPollOptions).toHaveBeenCalledWith(["Updated Option", "Option 2"]);
  });
});