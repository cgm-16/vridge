import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/ui/search-bar';

describe('SearchBar', () => {
  it('main variant: rounded-[60px] border 스타일', () => {
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={() => {}}
        placeholder="Search"
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('rounded-[60px]');
    expect(input).toHaveClass('border-[#b3b3b3]');
  });

  it('skills variant: bg-[#fbfbfb] 스타일', () => {
    render(
      <SearchBar
        variant="skills"
        value=""
        onChange={() => {}}
        placeholder="Search skills"
      />
    );
    const input = screen.getByPlaceholderText('Search skills');
    expect(input).toHaveClass('bg-[#fbfbfb]');
    expect(input).toHaveClass('rounded-[999px]');
  });

  it('skills variant: search 아이콘 렌더링', () => {
    const { container } = render(
      <SearchBar
        variant="skills"
        value=""
        onChange={() => {}}
        placeholder="Search"
      />
    );
    expect(container.querySelector('img[src*="search"]')).toBeInTheDocument();
  });

  it('placeholder 텍스트 표시', () => {
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={() => {}}
        placeholder="Search jobs"
      />
    );
    expect(screen.getByPlaceholderText('Search jobs')).toBeInTheDocument();
  });

  it('onChange 콜백 호출', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <SearchBar
        variant="main"
        value=""
        onChange={handleChange}
        placeholder="Search"
      />
    );
    await user.type(screen.getByPlaceholderText('Search'), 'test');
    expect(handleChange).toHaveBeenCalled();
  });
});
