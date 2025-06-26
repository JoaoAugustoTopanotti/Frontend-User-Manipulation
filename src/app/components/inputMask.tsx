import { IMaskInput } from 'react-imask';
import { Controller } from 'react-hook-form';

interface InputMaskProps {
  name: string;
  mask: string;
  control: any;
  placeholder?: string;
  readOnly?: boolean;
}

export const InputMask = ({ name, mask, control, placeholder, readOnly }: InputMaskProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <IMaskInput
          {...field}
          value={field.value ?? ''}
          lazy={true}
          mask={mask}
          unmask={false}
          onAccept={(value) => field.onChange(value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full rounded-md p-2.5 border border-gray-300 focus:outline-none"
        />
      )}
    />
  );
};