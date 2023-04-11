import { Input, InputProps } from "@chakra-ui/react"
import { forwardRef } from "react"

const DynamicWidthInput = forwardRef(
  (props: InputProps, ref: any): JSX.Element => (
    <Input
      ref={ref}
      {...props}
      width={`${props.value?.toString().length ?? 0}ch`}
      minW={1}
    />
  )
)

export default DynamicWidthInput