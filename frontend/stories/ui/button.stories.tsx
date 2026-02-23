import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { Button } from '@/frontend/components/ui/button';
import { useI18n } from '@/shared/i18n/client';
import type { MessageKey } from '@/shared/i18n/messages/en';

type LocalizedButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'children'
> & {
  labelKey: MessageKey;
};

function LocalizedButton({ labelKey, ...props }: LocalizedButtonProps) {
  const { t } = useI18n();
  return <Button {...props}>{t(labelKey)}</Button>;
}

function LocalizedBrandSizes() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="brand" size="brand-sm">
        {t('common.actions.add')}
      </Button>
      <Button variant="brand" size="brand-md">
        {t('jobs.applyNow')}
      </Button>
      <Button variant="brand" size="brand-lg">
        {t('common.actions.save')}
      </Button>
    </div>
  );
}

const meta = {
  title: '공통/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Prompt 20 브랜드 버튼 변형(brand/brand-outline/brand-disabled)과 브랜드 사이즈를 제공합니다.',
      },
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    children: {
      control: false,
    },
    variant: {
      control: 'select',
      options: ['brand', 'brand-outline', 'brand-disabled'],
    },
    size: {
      control: 'select',
      options: ['brand-sm', 'brand-md', 'brand-lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {
  render: (args) => <LocalizedButton {...args} labelKey="jobs.applyNow" />,
  args: {
    variant: 'brand',
    size: 'brand-md',
  },
};

export const BrandOutline: Story = {
  render: (args) => <LocalizedButton {...args} labelKey="jobs.share" />,
  args: {
    variant: 'brand-outline',
    size: 'brand-md',
  },
};

export const BrandDisabled: Story = {
  render: (args) => (
    <LocalizedButton {...args} labelKey="common.actions.saving" />
  ),
  args: {
    variant: 'brand-disabled',
    size: 'brand-md',
    disabled: true,
  },
};

export const BrandSizes: Story = {
  render: () => <LocalizedBrandSizes />,
};
