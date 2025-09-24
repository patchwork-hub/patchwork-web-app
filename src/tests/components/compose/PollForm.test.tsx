import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PollForm } from '@/components/organisms/compose/form/PollForm';

describe('PollForm Component', () => {
    it('renders the poll form with default options', () => {
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={vi.fn()}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        expect(screen.getByText('Create a poll')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Option 2')).toBeInTheDocument();
    });

    it('adds a new option when the Add option button is clicked', () => {
        const setPollOptionsMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={setPollOptionsMock}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        fireEvent.click(screen.getByText('Add option'));

        expect(setPollOptionsMock).toHaveBeenCalledWith(['Option 1', 'Option 2', '']);
    });

    it('removes an option when the delete button is clicked', () => {
        const setPollOptionsMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2', 'Option 3']}
                setPollOptions={setPollOptionsMock}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        fireEvent.click(screen.getByLabelText('Remove option 1'));

        expect(setPollOptionsMock).toHaveBeenCalledWith(['Option 2', 'Option 3']);
    });

    it('does not allow removing options if the number of options is equal to the minimum limit', () => {
        const setPollOptionsMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={setPollOptionsMock}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        expect(screen.queryByLabelText('Remove option 1')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Remove option 2')).not.toBeInTheDocument();
    });

    it('does not show the remove button if the number of options is equal to the minimum limit', () => {
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={vi.fn()}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        expect(screen.queryByLabelText('Remove option 1')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Remove option 2')).not.toBeInTheDocument();
    });

    it('updates the poll choice type when a new type is selected', () => {
        const setPollChoiceTypeMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={vi.fn()}
                pollChoiceType="single"
                setPollChoiceType={setPollChoiceTypeMock}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        fireEvent.click(screen.getByText('Single choice'));
        fireEvent.click(screen.getByText('Multiple choice'));

        expect(setPollChoiceTypeMock).toHaveBeenCalledWith('multiple');
    });

    it('updates the poll duration when a new duration is selected', () => {
        const setPollDurationMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2']}
                setPollOptions={vi.fn()}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={setPollDurationMock}
            />
        );

        // Find the duration SelectTrigger (second combobox, as there are two Select components)
        const durationSelects = screen.getAllByRole('combobox');
        const durationSelect = durationSelects[1]; // Second combobox is for duration
        expect(durationSelect).toHaveTextContent(/1\s*day/i); // Use regex for flexible matching

        // Click to open the dropdown
        fireEvent.click(durationSelect);

        // Find and click "3 days" in the dropdown
        const dropdown = screen.getByRole('listbox');
        fireEvent.click(within(dropdown).getByText('3 days'));

        expect(setPollDurationMock).toHaveBeenCalledWith(259200);
    });

    it('does not allow adding more options than the maximum limit', () => {
        const setPollOptionsMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', 'Option 2', 'Option 3', 'Option 4']}
                setPollOptions={setPollOptionsMock}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        fireEvent.click(screen.getByText('Add option'));

        expect(setPollOptionsMock).not.toHaveBeenCalled();
    });

    it('handles empty options correctly', () => {
        const setPollOptionsMock = vi.fn();
        render(
            <PollForm
                pollOptions={['Option 1', '']}
                setPollOptions={setPollOptionsMock}
                pollChoiceType="single"
                setPollChoiceType={vi.fn()}
                pollDuration={86400}
                setPollDuration={vi.fn()}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Option 2'), { target: { value: 'Option 2' } });

        expect(setPollOptionsMock).toHaveBeenCalledWith(['Option 1', 'Option 2']);
    });
});