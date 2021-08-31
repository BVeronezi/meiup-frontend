import { Meta } from '@storybook/react'
import MButton from '.';

export default {
  component: MButton,
  title: 'Components/Button'
} as Meta

const Template = (args:any) => <MButton {...args} />;

export const Default: any = Template.bind({});
Default.args = {
  children: "Button",
  width: "40",
  color: "white",
  // background: "gray",
  // backgroundColor: "gray"
};
