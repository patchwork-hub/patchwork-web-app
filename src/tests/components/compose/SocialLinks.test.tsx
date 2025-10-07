import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SocialLinks from "@/components/organisms/profile/SocialLinks";
import { SOCIAL_MEDIA_LINKS } from "@/utils/constant";
import * as socialLinkHelpers from "@/utils/helper/socialLink";

vi.mock("@/utils/constant", () => ({
  SOCIAL_MEDIA_LINKS: [
    { title: "Twitter", icon: <span>TwitterIcon</span> },
    { title: "GitHub", icon: <span>GitHubIcon</span> },
    { title: "LinkedIn", icon: <span>LinkedInIcon</span> },
  ],
  Icons: {
    Twitter: <span>TwitterIcon</span>,
    GitHub: <span>GitHubIcon</span>,
    LinkedIn: <span>LinkedInIcon</span>,
  },
}));

vi.mock("@/utils/helper/socialLink", () => ({
  cleanText: vi.fn((text) => text),
  extractUserName: vi.fn((text) => text.split("/").pop() || ""),
}));

vi.mock("@/components/atoms/icons/Icons", () => ({
  GlobeIcon: () => <span>GlobeIcon</span>,
}));

//
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({
    children,
    "aria-describedby": ariaDescribedBy,
  }: {
    children: React.ReactNode;
    "aria-describedby"?: string;
  }) => (
    <div
      role="dialog"
      aria-describedby={ariaDescribedBy || "dialog-description"}
    >
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id?: string;
  }) => <p id={id || "dialog-description"}>{children}</p>,
}));

describe("SocialLinks Component", () => {
  const defaultProps = {
    openThemeModal: true,
    onClose: vi.fn(),
    onPressAdd: vi.fn(),
    onPressDelete: vi.fn(),
    data: [],
    formType: "add" as "add" | "edit",
    isOwnProfile: true,
  };

  it("renders the dialog with available social links in add mode", () => {
    render(<SocialLinks {...defaultProps} />);

    expect(screen.getByText("Add new link")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-describedby");
  });

  it("renders existing social links in edit mode", () => {
    const data = [
      { name: "Twitter", value: "https://twitter.com/testuser" },
      { name: "GitHub", value: "https://github.com/testuser" },
    ];
    render(<SocialLinks {...defaultProps} formType="edit" data={data} />);

    expect(screen.getByText("Edit link")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.queryByText("LinkedIn")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("trash-icon")).toHaveLength(2);

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-describedby");
  });

  it("allows selecting a social link and adding a username", () => {
    const onPressAddMock = vi.fn();
    render(<SocialLinks {...defaultProps} onPressAdd={onPressAddMock} />);

    fireEvent.click(screen.getByText("Twitter"));

    const input = screen.getByPlaceholderText("username");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "testuser" } });

    const addButton = screen.getByText("Add");
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    expect(onPressAddMock).toHaveBeenCalledWith("Twitter", "testuser");
  });

  it("disables the add button when username is empty", () => {
    render(<SocialLinks {...defaultProps} />);

    fireEvent.click(screen.getByText("Twitter"));

    const addButton = screen.getByRole("button", { name: /Add/i });
    expect(addButton).toBeDisabled();
  });

  it("populates username in edit mode for selected link", () => {
    const data = [{ name: "Twitter", value: "https://twitter.com/testuser" }];
    render(<SocialLinks {...defaultProps} formType="edit" data={data} />);

    fireEvent.click(screen.getByText("Twitter"));

    const input = screen.getByPlaceholderText("username");
    expect(input).toHaveValue("testuser");
    expect(socialLinkHelpers.extractUserName).toHaveBeenCalledWith(
      "https://twitter.com/testuser"
    );
  });

  it("calls onPressDelete when delete button is clicked in edit mode", () => {
    const onPressDeleteMock = vi.fn();
    const data = [{ name: "Twitter", value: "https://twitter.com/testuser" }];
    render(
      <SocialLinks
        {...defaultProps}
        formType="edit"
        data={data}
        onPressDelete={onPressDeleteMock}
      />
    );

    const deleteButton = screen.getByLabelText("Delete Twitter link");
    fireEvent.click(deleteButton);

    expect(onPressDeleteMock).toHaveBeenCalledWith("Twitter");
  });

  it("displays message when no social links are available in add mode", () => {
    const data = SOCIAL_MEDIA_LINKS.map((link) => ({
      name: link.title,
      value: `https://${link.title.toLowerCase()}.com/testuser`,
    }));
    render(<SocialLinks {...defaultProps} data={data} />);

    expect(
      screen.getByText("All social links have been added!")
    ).toBeInTheDocument();
  });

  it("displays message when no social links exist in edit mode", () => {
    render(<SocialLinks {...defaultProps} formType="edit" data={[]} />);

    expect(
      screen.getByText("All social links have been removed!")
    ).toBeInTheDocument();
  });

  it("closes the dialog and resets state when onClose is called", () => {
    const onCloseMock = vi.fn();
    render(<SocialLinks {...defaultProps} onClose={onCloseMock} />);

    fireEvent.click(screen.getByText("Twitter"));
    fireEvent.click(screen.getByTestId("x-icon"));

    expect(onCloseMock).toHaveBeenCalled();
    expect(screen.queryByPlaceholderText("username")).not.toBeInTheDocument();
  });

  it("does not render dialog when openThemeModal is false", () => {
    render(<SocialLinks {...defaultProps} openThemeModal={false} />);

    expect(screen.queryByText("Add new link")).not.toBeInTheDocument();
    expect(screen.queryByText("Twitter")).not.toBeInTheDocument();
  });
});
