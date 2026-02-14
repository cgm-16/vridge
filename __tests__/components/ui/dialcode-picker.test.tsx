import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialcodePicker } from '@/components/ui/dialcode-picker';

describe('DialcodePicker', () => {
  it('현재 코드 표시', () => {
    render(<DialcodePicker value="+82" onChange={() => {}} />);
    expect(screen.getByText('+82')).toBeInTheDocument();
  });

  it('클릭 시 코드 목록 표시', async () => {
    const user = userEvent.setup();
    render(<DialcodePicker value="+82" onChange={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('+44')).toBeInTheDocument();
  });

  it('코드 선택 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<DialcodePicker value="+82" onChange={handleChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('+1'));
    expect(handleChange).toHaveBeenCalledWith('+1');
  });
});
