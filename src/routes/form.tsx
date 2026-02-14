import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/ui/ripple-button'
import { useForm } from '@/hooks/use-form'

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    schema: (value) => {
      const issues = []

      if (value.firstName.length < 3)
        issues.push({
          message: 'First name must be at least 3 characters long',
          path: ['firstName'],
        })

      if (value.lastName.length < 3)
        issues.push({
          message: 'Last name must be at least 3 characters long',
          path: ['lastName'],
        })

      if (issues.length > 0) return { issues }
      return { value }
    },
    onSubmit: (value) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <form
      className='container max-w-md'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <FieldLegend>Example Form</FieldLegend>

        <FieldGroup>
          <form.Field
            name='firstName'
            render={({ field, meta }) => (
              <Field>
                <FieldLabel htmlFor={field.id}>First Name:</FieldLabel>
                <Input {...field} />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='lastName'
            render={({ field, meta }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Last Name:</FieldLabel>
                <Input {...field} />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <RippleButton type='submit' disabled={form.state.isPending}>
              Submit
              <RippleButtonRipples />
            </RippleButton>

            <RippleButton
              type='reset'
              onClick={(e) => {
                e.preventDefault()
                form.reset()
              }}
              disabled={form.state.isPending}
            >
              Reset
              <RippleButtonRipples />
            </RippleButton>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
